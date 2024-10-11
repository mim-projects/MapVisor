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
    #props
    #loaded = false

    constructor(data = { category: "", isPrimary: false, crossOrigin: null }, src, x = 0, y = 0, w = null, h = null, props = { blockSize: false, positionCenter: false }) {
        this.#data = data
        this.#image = new Image()
        this.#image.crossOrigin = data.crossOrigin
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
    #eventsHelper
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
        this.#eventsHelper = {
            onMousePress: false
        }
        this.#dev = { debug, debugBoxWidth: 10 }
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

    async resize(delay = 0) {
        await new Promise(resolve => {
            setTimeout(() => {
                const parent = this.#context.canvas.parentElement
                this.#context.canvas.width = parent.getBoundingClientRect().width
                this.#context.canvas.height = parent.getBoundingClientRect().height
                resolve()
            }, delay)
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

        // scale
        if (actor.dimension.x > this.#context.canvas.width && actor.dimension.y > this.#context.canvas.height) {
            const r1 = this.#context.canvas.width / actor.dimension.x
            const r2 = this.#context.canvas.height / actor.dimension.y
            this.#viewport.scale = r1 > r2 ? r2 : r1
        } else if (actor.dimension.x < this.#context.canvas.width && actor.dimension.y < this.#context.canvas.height) {
            const r1 = this.#context.canvas.width / actor.dimension.x
            const r2 = this.#context.canvas.height / actor.dimension.y
            this.#viewport.scale = r1 < r2 ? r2 : r1
        } else if (actor.dimension.x > this.#context.canvas.width) {
            this.#viewport.scale = this.#context.canvas.width / actor.dimension.x
        } else if (actor.dimension.y > this.#context.canvas.height) {
            this.#viewport.scale = this.#context.canvas.height / actor.dimension.y
        }

        // position
        const viewportCenter = {
            x: this.#context.canvas.width / 2,
            y: this.#context.canvas.height / 2
        }
        const actorCenter = {
            x: actor.position.x + (actor.dimension.x / 2),
            y: actor.position.y + (actor.dimension.y / 2)
        }
        const moveX = viewportCenter.x - (actorCenter.x * this.#viewport.scale)
        const moveY = viewportCenter.y - (actorCenter.y * this.#viewport.scale)
        this.#viewport.position.x += moveX
        this.#viewport.position.y += moveY
        this.#viewport.positionHelper.x = moveX
        this.#viewport.positionHelper.y = moveY
    }

    #events(htmlElement) {
        this.#context.canvas.style.cursor = "grab"
        this.#context.canvas.style.userSelect = "none"
        this.#context.canvas.addEventListener("mousedown", (e) => {
            this.#eventsHelper.onMousePress = true
            if (this.#context.canvas.style.cursor !== "pointer") {
                const x = e.pageX - e.currentTarget.offsetLeft - this.#context.canvas.getBoundingClientRect().x
                const y = e.pageY - e.currentTarget.offsetTop - this.#context.canvas.getBoundingClientRect().y
                this.#context.canvas.style.cursor = "grabbing"
                this.#viewport.onClickPointer.x = x
                this.#viewport.onClickPointer.y = y
            }
        })
        this.#context.canvas.addEventListener("mouseup", (e) => {
            this.#eventsHelper.onMousePress = false
            if (this.#context.canvas.style.cursor !== "pointer") {
                this.#context.canvas.style.cursor = "grab"
                this.#viewport.positionHelper.x = this.#viewport.position.x
                this.#viewport.positionHelper.y = this.#viewport.position.y
            } else {
                const x = e.pageX - e.currentTarget.offsetLeft - this.#context.canvas.getBoundingClientRect().x
                const y = e.pageY - e.currentTarget.offsetTop - this.#context.canvas.getBoundingClientRect().y
                this.#onClickCallback(this.#actors.filter(actor => actor.contentPointer(x, y, this.#dev.debugBoxWidth, this.#viewport)))
            }
        })
        this.#context.canvas.addEventListener("mouseout", (e) => {
            if (this.#context.canvas.style.cursor !== "pointer") {
                this.#context.canvas.style.cursor = "grab"
                this.#viewport.positionHelper.x = this.#viewport.position.x
                this.#viewport.positionHelper.y = this.#viewport.position.y
            }
        })
        this.#context.canvas.addEventListener("mousemove", (e) => {
            const x = e.pageX - e.currentTarget.offsetLeft - this.#context.canvas.getBoundingClientRect().x
            const y = e.pageY - e.currentTarget.offsetTop - this.#context.canvas.getBoundingClientRect().y
            if (this.#context.canvas.style.cursor !== "grabbing") {
                if (this.#eventsHelper.onMousePress) {
                    this.#context.canvas.style.cursor = "grabbing"
                    this.#viewport.onClickPointer.x = x
                    this.#viewport.onClickPointer.y = y
                } else if (this.#actors.filter(actor => actor.contentPointer(x, y, this.#dev.debugBoxWidth, this.#viewport)).length > 0) {
                    this.#context.canvas.style.cursor = "pointer"
                } else {
                    this.#context.canvas.style.cursor = "grab"
                }
            }
            if (this.#context.canvas.style.cursor === "grabbing") {
                const posX = this.#viewport.positionHelper.x + (x - this.#viewport.onClickPointer.x)
                const posY = this.#viewport.positionHelper.y + (y - this.#viewport.onClickPointer.y)
                this.#viewport.position.x = posX
                this.#viewport.position.y = posY
            }
            this.render()
            if (this.#dev.debug) {
                this.#context.fillRect(x - this.#dev.debugBoxWidth, y - this.#dev.debugBoxWidth, this.#dev.debugBoxWidth * 2, this.#dev.debugBoxWidth * 2)
            }
        })
        this.#context.canvas.addEventListener("wheel", (e) => {
            if (e.wheelDeltaY > 0) {
                this.#viewport.scale *= 1.1
            } else {
                this.#viewport.scale *= 0.9
            }
            this.render()
        })

        // ----------------------------------
        // ----------------------------------
        // Button Controls
        htmlElement.style.position = "relative"
        const containerControls = document.createElement("div")
        htmlElement.appendChild(containerControls)
        containerControls.style.display = "grid"
        containerControls.style.gridTemplateColumns = "1fr"
        containerControls.style.position = "absolute"
        containerControls.style.margin = "1rem"
        containerControls.style.gap = "0.5rem"
        containerControls.style.bottom = "0"
        containerControls.style.right = "0"

        const styleButton = {
            width: "1.25rem",
            height: "1.25rem",
            padding: "0.25rem",
            userSelect: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: "5px",
            overflow: "hidden",
            boxShadow: "0 0 5px 1px rgba(0, 0, 0, 0.25)"
        }

        const zoomIn = document.createElement("div")
        zoomIn.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"240\" height=\"240\" viewBox=\"0 0 24 24\" style=\"fill: rgba(0, 0, 0, 1);transform: ;msFilter:;\"><path d=\"M19 11h-6V5h-2v6H5v2h6v6h2v-6h6z\"></path></svg>"
        zoomIn.title = "zoom in"
        zoomIn.onclick = () => {
            this.#viewport.scale *= 1.1
            this.render()
        }

        const zoomOut = document.createElement("div")
        zoomOut.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"240\" height=\"240\" viewBox=\"0 0 24 24\" style=\"fill: rgba(0, 0, 0, 1);transform: ;msFilter:;\"><path d=\"M5 11h14v2H5z\"></path></svg>"
        zoomOut.title = "zoom out"
        zoomOut.onclick = () => {
            this.#viewport.scale *= 0.9
            this.render()
        }

        const reset = document.createElement("div")
        reset.innerHTML = "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"240\" height=\"240\" viewBox=\"0 0 24 24\" style=\"fill: rgba(0, 0, 0, 1);transform: ;msFilter:;\"><path d=\"M12 16c1.671 0 3-1.331 3-3s-1.329-3-3-3-3 1.331-3 3 1.329 3 3 3z\"></path><path d=\"M20.817 11.186a8.94 8.94 0 0 0-1.355-3.219 9.053 9.053 0 0 0-2.43-2.43 8.95 8.95 0 0 0-3.219-1.355 9.028 9.028 0 0 0-1.838-.18V2L8 5l3.975 3V6.002c.484-.002.968.044 1.435.14a6.961 6.961 0 0 1 2.502 1.053 7.005 7.005 0 0 1 1.892 1.892A6.967 6.967 0 0 1 19 13a7.032 7.032 0 0 1-.55 2.725 7.11 7.11 0 0 1-.644 1.188 7.2 7.2 0 0 1-.858 1.039 7.028 7.028 0 0 1-3.536 1.907 7.13 7.13 0 0 1-2.822 0 6.961 6.961 0 0 1-2.503-1.054 7.002 7.002 0 0 1-1.89-1.89A6.996 6.996 0 0 1 5 13H3a9.02 9.02 0 0 0 1.539 5.034 9.096 9.096 0 0 0 2.428 2.428A8.95 8.95 0 0 0 12 22a9.09 9.09 0 0 0 1.814-.183 9.014 9.014 0 0 0 3.218-1.355 8.886 8.886 0 0 0 1.331-1.099 9.228 9.228 0 0 0 1.1-1.332A8.952 8.952 0 0 0 21 13a9.09 9.09 0 0 0-.183-1.814z\"></path></svg>"
        reset.title = "reset"
        reset.onclick = () => {
            this.#viewport.scale = 1
            this.#viewport.position = new Vector2d(0, 0)
            this.#viewport.positionHelper = new Vector2d(0, 0)
            this.#updateViewportRelativePrimary()
            this.render()
        }

        for (let property in styleButton) {
            zoomIn.style[property] = styleButton[property]
            zoomOut.style[property] = styleButton[property]
            reset.style[property] = styleButton[property]
        }

        containerControls.append(zoomIn)
        containerControls.append(zoomOut)
        containerControls.append(reset)
    }
}