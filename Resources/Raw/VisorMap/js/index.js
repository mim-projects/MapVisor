const API_SERVER = "#{API_SERVER}"
const WEB_SOCKET = "#{WEB_SOCKET}"
const IMAGE_SERVER = "#{IMAGE_SERVER}"
let MAP_DATA = {}
let MAP_FILTERS = {}

// =======================================================
// =======================================================
// =======================================================
// =======================================================

const hiddenLoader = () => {
    document.querySelectorAll(".js-custom-loader").forEach(item => document.querySelector("body").removeChild(item))
    console.log("hide loader")
}

const showMapError = (error) => {
    const divError = document.createElement("div")
    divError.style.position = "fixed";
    divError.style.zIndex = "999999";
    divError.style.backgroundColor = "#{cc.attrs.background}";
    divError.style.padding = "2rem";
    divError.style.width = "100%";
    divError.style.height = "100%";
    divError.style.left = "0";
    divError.style.top = "0";
    divError.style.display = "grid";
    divError.style.gap = "2rem";
    divError.style.justifyContent = "center";
    divError.style.alignContent = "center";

    let span = document.createElement("span")
    span.textContent = "#{bundle.error}"
    span.style.fontSize = "1rem"
    divError.append(span)

    span = document.createElement("span")
    span.textContent = error
    span.style.fontSize = "1rem"
    divError.append(span)

    document.querySelector("body").appendChild(divError)
}

const showIconsHelp = () => {
    const container = document.createElement("div")
    container.classList.add("modal-icon-helper")
    container.classList.add("modal-block")

    const modal = document.createElement("div")
    modal.classList.add("custom-modal")

    // Header
    const modalHeader = document.createElement("div")
    const modalHeaderTitle = document.createElement("h1")
    const modalHeaderClose = document.createElement("span")
    modalHeader.classList.add("custom-modal-header")
    modalHeaderClose.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"></path></svg>`
    modalHeaderClose.onclick = () => document.querySelector("body").removeChild(document.querySelector(".modal-icon-helper"))
    modalHeaderTitle.textContent = "#{bundle.simbology}"
    modalHeader.appendChild(modalHeaderTitle)
    modalHeader.appendChild(modalHeaderClose)
    modal.appendChild(modalHeader)

    // Body
    const modalBody = document.createElement("div")
    modalBody.classList.add("custom-modal-body")
    modalBody.innerHTML = `<table>
        <thead>
            <tr>
                <th>#{bundle.activity_type}</th>
                <th>#{bundle.complete}</th>
                <th>#{bundle.not_signed_first}</th>
                <th>#{bundle.signed_first}</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>#{bundle.cutting_welding_work}</td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoHotGreen.png"/></td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoHotRed.png"/></td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoHotAmaNegro.png"/></td>
            </tr>
            <tr>
                <td>#{bundle.lines_with_fluids}</td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoCo2Green.png"/></td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoCo2Red.png"/></td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoCo2AmaNegro.png"/></td>
            </tr>
            <tr>
                <td>#{bundle.electrical_work}</td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoElecGreen.png"/></td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoElecRed.png"/></td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoElecAmaNegro.png"/></td>
            </tr>
            <tr>
                <td>#{bundle.confined_space}</td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoEspGreen.png"/></td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoEspRed.png"/></td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoEspAmaNegro.png"/></td>
            </tr>
            <tr>
                <td>#{bundle.height}</td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoAltGreen.png"/></td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoAltRed.png"/></td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoAltAmaNegro.png"/></td>
            </tr>
            <tr>
                <td>#{bundle.chemicals_handle}</td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoQuiGreen.png"/></td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoQuiRed.png"/></td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/icoQuiAmaNegro.png"/></td>
            </tr>
            <tr>
                <td>#{bundle.other}</td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/active.png"/></td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/inActivve.png"/></td>
                <td><img src="#{IMAGE_SERVER}#{cc.attrs.plant}/working.png"/></td>
            </tr>
        </tbody>
    </table>`
    modal.appendChild(modalBody)

    container.appendChild(modal)
    document.querySelector("body").appendChild(container)
}

const showModalCompanies = () => {
    alert("showModalCompanies")
}

const showModalAreas = () => {
    alert("showModalAreas")
}

const showModalActivities = () => {
    alert("showModalActivities")
}

const resetMapData = async () => {
    console.log("Descargar todos los datos iniciales / sin filtros")
    MAP_DATA = {
        info: {
            signedFirst: 10,
            noSignedFirst: 20,
            complete: 30,
            amountPersonal: 150
        },
        companies: [
            { id: 1, value: "Companie 1" },
            { id: 2, value: "Companie 2" },
            { id: 3, value: "Companie 3" },
        ],
        areas: [
            { id: 1, value: "Area 1" },
        ],
        activities: [
            { id: 1, value: "Activity 1" },
        ],
    }
}

const resetMapFilters = async () => {
    await resetMapData()

    const date = new Date()
    const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`

    MAP_FILTERS = {
        map: "#{cc.attrs.plant}",
        date: formattedDate,
        status: {
            signedFirst: true,
            noSignedFirst: true,
            complete: true
        },
        companies: [...MAP_DATA.companies.map(item => item.id)],
        areas: [...MAP_DATA.areas.map(item => item.id)],
        activities: [...MAP_DATA.activities.map(item => item.id)]
    }
}

const applyFilters = async () => {
    console.log("Aplicar filtros", MAP_FILTERS)
}

const onLoadBody = async () => {
    await resetMapFilters()

    // Variables
    const infoSignedFirst = document.getElementById("info_signed_first")
    const infoNoSignedFirst = document.getElementById("info_not_signed_first")
    const infoComplete = document.getElementById("info_complete")
    const infoAmountPersonal = document.getElementById("info_amount_personal")
    const filterDate = document.getElementById("filter_date")
    const filterDateHelpText = document.getElementById("filter_date_help_text")
    const filterSignedFirst = document.getElementById("filter_signed_first")
    const filterNoSignedFirst = document.getElementById("filter_not_signed_first")
    const filterComplete = document.getElementById("filter_complete")

    // Start Values
    infoSignedFirst.innerText = MAP_DATA.info.signedFirst
    infoNoSignedFirst.innerText = MAP_DATA.info.noSignedFirst
    infoComplete.innerText = MAP_DATA.info.complete
    infoAmountPersonal.innerText = MAP_DATA.info.amountPersonal
    filterDateHelpText.innerText = MAP_FILTERS.date
    filterDate.value = MAP_FILTERS.date
    filterSignedFirst.checked = MAP_FILTERS.status.signedFirst
    filterNoSignedFirst.checked = MAP_FILTERS.status.noSignedFirst
    filterComplete.checked = MAP_FILTERS.status.complete

    // OnClick Filters
    document.querySelector(".input-date-parent-activator").onclick = e => {
        filterDate.showPicker()
    }

    // Other Listener
    filterDate.onchange = () => {
        MAP_FILTERS.date = filterDate.value
        filterDateHelpText.innerText = MAP_FILTERS.date
    }
    filterSignedFirst.onchange = () => MAP_FILTERS.status.signedFirst = filterSignedFirst.checked
    filterNoSignedFirst.onchange = () => MAP_FILTERS.status.noSignedFirst = filterNoSignedFirst.checked
    filterComplete.onchange = () => MAP_FILTERS.status.complete = filterComplete.checked
}

// =======================================================
// =======================================================
// =======================================================
// =======================================================

const createCustomPin = (stage, data) => {
    const sizeBox = 40
    if (data.id === undefined || data.icon === undefined || data.position.x === undefined || data.position.y === undefined) return;
    if (stage.filter("id", data.id).length > 0) return
    stage.addAsync(new Actor({
        id: data.id,
        isPrimary: false,
        crossOrigin: "Anonymous",
        category: "company"
    }, data.icon, data.position.x + 60 + sizeBox, data.position.y + 120 + sizeBox, sizeBox, sizeBox, {
        positionCenter: true,
        blockSize: true
    }))
}

const onloadmap = async () => {
    hiddenLoader()
}

const onloadmaperror = (error) => {
    hiddenLoader()
    showMapError(error)
}

// =======================================================
// =======================================================
// =======================================================
// =======================================================

window.addEventListener("load", async () => {
    if (window.STAGE === undefined) window.STAGE = []

    window.STAGE["#{cc.attrs.plant}"] = new Stage(
        document.getElementById("map_visor_#{cc.attrs.plant}"),
        "#{cc.attrs.debug}" === "true",
        "#{cc.attrs.sizeControlBtn}"
    )
    window.STAGE["#{cc.attrs.plant}"].addListenerOnClick(e => console.log(e))

    window.addEventListener("resize", async () => {
        for (const current in window.STAGE) {
            if (current !== undefined) {
                await window.STAGE[current].resize(210)
                window.STAGE[current].render()
            }
        }
    })

    document.querySelector(".dashboard-#{cc.attrs.plant} .dashboard-sidebar-btn-menu").onclick = async () => {
        document.querySelector(".dashboard-#{cc.attrs.plant} .dashboard-body").classList.toggle("dashboard-body-extend")
        document.querySelector(".dashboard-#{cc.attrs.plant} .dashboard-sidebar").classList.toggle("dashboard-sidebar-active")
        await window.STAGE["#{cc.attrs.plant}"].resize(210)
        window.STAGE["#{cc.attrs.plant}"].render()
    }

    window.STAGE["#{cc.attrs.plant}"].addAsync(new Actor(
        { isPrimary: true, category: "map", crossOrigin: null },
        "#{IMAGE_SERVER}#{cc.attrs.plant}/mapa.jpg", 0, 0
    )).then(() => {
        if (onloadmap !== undefined) onloadmap()
    }).catch((error) => {
        if (onloadmaperror !== undefined) onloadmaperror(error)
    })

    await onLoadBody()
})