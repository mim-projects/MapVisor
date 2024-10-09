class Vector2d {
    #x
    #y

    constructor(x, y) {
        this.#x = x
        this.#y = y
    }

    get x() {
        return this.#x
    }

    set x(value) {
        this.#x = value
    }

    get y() {
        return this.#y
    }

    set y(value) {
        this.#y = value
    }
}



class Actor {
    #image
    #data
    #dimension
    #position
    #isPrimary
    #props
    #loaded = false

    constructor(data = { category: "", isPrimary: false }, src, x = 0, y = 0, w = null, h = null, props = { blockSize: false, positionCenter: false }) {
        this.#data = data
        this.#image = new Image()
        this.#image.src = src
        this.#props = props

        this.#position = new Vector2d(x, y)
        this.#dimension = new Vector2d(w, h)
    }

    #normalize(viewport) {
        let w = this.#dimension.x * (this.#props.blockSize ? 1 : viewport.scale)
        let h = this.#dimension.y * (this.#props.blockSize ? 1 : viewport.scale)
        let x = ((this.#position.x * viewport.scale) + viewport.position.x) - (this.#props.positionCenter ? w / 2 : 0)
        let y = ((this.#position.y * viewport.scale) + viewport.position.y) - (this.#props.positionCenter ? w / 2 : 0)
        return { w, h, x, y }
    }

    update() {
        this.#loaded = true
        if (this.#dimension.x != null && this.#dimension.y != null) return
        this.#dimension = new Vector2d(this.#image.width, this.#image.height)
    }

    render(context, viewport, dev) {
        if (!this.#loaded) return
        const { w, h, x, y } = this.#normalize(viewport)
        context.drawImage(this.#image, x, y, w, h)

        if (dev.debug) {
            context.strokeStyle = "blue"
            context.strokeRect(x, y, w, h)
            context.beginPath()
            context.moveTo(x, y)
            context.lineTo(x + w, y + h)
            context.stroke()
            context.beginPath()
            context.moveTo(x, y + h)
            context.lineTo(x + w, y)
            context.stroke()
        }
    }

    contentPointer(x, y, range, viewport) {
        if (this.#data.category === "map") return false
        const normalize = this.#normalize(viewport)
        return ((normalize.x - range) < x && (normalize.x + normalize.w + range) > x) && ((normalize.y - range) < y && (normalize.y + normalize.h + range) > y)
    }

    get image() {
        return this.#image
    }

    get position() {
        return this.#position
    }

    get dimension() {
        return this.#dimension
    }

    get data() {
        return this.#data
    }
}



class Stage {
    #actors
    #context
    #viewport
    #dev
    #onClickCallback = (data) => {}

    constructor(htmlElement, debug = false) {
        this.#actors = []
        this.#context = this.#createContext(htmlElement)
        this.#viewport = {
            scale: 1,
            position: new Vector2d(0, 0),
            positionHelper: new Vector2d(0, 0),
            onClickPointer: new Vector2d(0, 0)
        }
        this.#dev = { debug }
        this.#events(htmlElement)

        if (this.#dev.debug) {
            this.#context.canvas.style.border = "1px solid red"
        }
    }

    addListenerOnClick(callback = (data) => {}) {
        this.#onClickCallback = callback
    }

    async addAsync(actor, render = true) {
        this.#actors.push(actor)
        await new Promise((resolve, reject) => {
            actor.image.onerror = () => reject()
            actor.image.onload = () => {
                actor.update()
                if (actor.data.isPrimary) this.#updateViewportRelativePrimary(actor)
                if (render) this.render()
                resolve()
            }
        })
    }

    render() {
        this.#context.clearRect(0, 0, this.#context.canvas.width, this.#context.canvas.height)
        this.#actors.forEach(actor => actor.render(this.#context, this.#viewport, this.#dev))

        if (this.#dev.debug) {
            this.#context.fillStyle = "red"
            this.#context.fillRect(0, this.#context.canvas.height / 2, this.#context.canvas.width, 1)
            this.#context.fillRect(this.#context.canvas.width / 2, 0, 1, this.#context.canvas.height)
        }
    }

    #createContext(htmlElement) {
        const canvas = document.createElement("canvas")
        canvas.width = htmlElement.getBoundingClientRect().width
        canvas.height = htmlElement.getBoundingClientRect().height
        htmlElement.appendChild(canvas)
        return canvas.getContext("2d")
    }

    #updateViewportRelativePrimary(actor = null) {
        for (let current of this.#actors) {
            if (current.data.isPrimary) {
                actor = current
                break
            }
        }
        if (actor == null) return

        const viewportCenter = {
            x: this.#context.canvas.width / 2,
            y: this.#context.canvas.height / 2
        }
        const actorCenter = {
            x: actor.position.x + (actor.dimension.x / 2),
            y: actor.position.y + (actor.dimension.y / 2)
        }
        const moveX = viewportCenter.x - actorCenter.x
        const moveY = viewportCenter.y - actorCenter.y
        this.#viewport.position.x += moveX
        this.#viewport.position.y += moveY
        this.#viewport.positionHelper.x = moveX
        this.#viewport.positionHelper.y = moveY
    }

    #events(htmlElement) {
        this.#context.canvas.style.cursor = "grab"
        this.#context.canvas.addEventListener("mousedown", (e) => {
            const x = e.pageX - e.currentTarget.offsetLeft
            const y = e.pageY - e.currentTarget.offsetTop
            if (this.#context.canvas.style.cursor !== "pointer") {
                this.#context.canvas.style.cursor = "grabbing"
                this.#viewport.onClickPointer.x = x
                this.#viewport.onClickPointer.y = y
            } else {
                this.#onClickCallback(this.#actors.filter(actor => actor.contentPointer(x, y, 10, this.#viewport)))
            }
        })
        this.#context.canvas.addEventListener("mouseup", (e) => {
            if (this.#context.canvas.style.cursor !== "pointer") {
                this.#context.canvas.style.cursor = "grab"
                this.#viewport.positionHelper.x = this.#viewport.position.x
                this.#viewport.positionHelper.y = this.#viewport.position.y
            }
        })
        this.#context.canvas.addEventListener("mousemove", (e) => {
            const x = e.pageX - e.currentTarget.offsetLeft
            const y = e.pageY - e.currentTarget.offsetTop
            if (this.#context.canvas.style.cursor !== "grabbing") {
                if (this.#actors.filter(actor => actor.contentPointer(x, y, 10, this.#viewport)).length > 0) {
                    this.#context.canvas.style.cursor = "pointer"
                } else {
                    this.#context.canvas.style.cursor = "grab"
                }
            } else {
                const posX = this.#viewport.positionHelper.x + (x - this.#viewport.onClickPointer.x)
                const posY = this.#viewport.positionHelper.y + (y - this.#viewport.onClickPointer.y)
                this.#viewport.position.x = posX
                this.#viewport.position.y = posY
            }
            this.render()
            if (this.#dev.debug) this.#context.fillRect(x - 10, y - 10, 20, 20)
        })

        this.#context.canvas.addEventListener("scroll", (event) => console.log("xxxx"))

        // ----------------------------------
        // ----------------------------------
        // Button Controls
        htmlElement.style.position = "relative"
        const containerControls = document.createElement("div")
        htmlElement.appendChild(containerControls)
        containerControls.style.display = "grid"
        containerControls.style.gridTemplateColumns = "1fr 1fr 1fr"
        containerControls.style.position = "absolute"
        containerControls.style.margin = "0 0 1rem 2rem"
        containerControls.style.bottom = 0
        containerControls.style.left = 0

        const zoomIn = document.createElement("div")
        zoomIn.style.width = "1.5rem"
        zoomIn.style.height = "1.5rem"
        zoomIn.textContent = "+"
        zoomIn.style.userSelect = "none"
        zoomIn.style.cursor = "pointer"
        zoomIn.onclick = () => {
            this.#viewport.scale *= 1.1
            this.render()
        }

        const zoomOut = document.createElement("div")
        zoomOut.style.width = "1.5rem"
        zoomOut.style.height = "1.5rem"
        zoomOut.textContent = "-"
        zoomOut.style.userSelect = "none"
        zoomOut.style.cursor = "pointer"
        zoomOut.onclick = () => {
            this.#viewport.scale *= 0.9
            this.render()
        }

        const reset = document.createElement("div")
        reset.style.width = "1.5rem"
        reset.style.height = "1.5rem"
        reset.textContent = "#"
        reset.style.userSelect = "none"
        reset.style.cursor = "pointer"
        reset.onclick = () => {
            this.#viewport.scale = 1
            this.#viewport.position = new Vector2d(0, 0)
            this.#viewport.positionHelper = new Vector2d(0, 0)
            this.#updateViewportRelativePrimary()
            this.render()
        }

        containerControls.append(zoomIn)
        containerControls.append(zoomOut)
        containerControls.append(reset)
    }
}