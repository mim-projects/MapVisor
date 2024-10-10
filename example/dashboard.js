const mapVisor = document.getElementById("map_visor")
const stage = new Stage(mapVisor, false)

stage.addListenerOnClick(data => alert("items clicked " + data.length))

const map = new Actor({ isPrimary: true, category: "map" }, "../assets/mapa2.png", 0, 0)
stage.addAsync(map)

// El pin se redimensiona con el zoom del viewport | se pinta desde la esquina superior izq en lugar del centro
stage.addAsync(new Actor({ isPrimary: false, category: "pin" }, "../assets/pin.png", 100, 100, 100, 100))

setInterval(() => {
    stage.addAsync(new Actor({ isPrimary: false, category: "pin" }, "../assets/pin.png",
        Math.random() * map.image.width,
        Math.random() * map.image.height,
        40, 40, {
            positionCenter: true,
            blockSize: true
        }))
}, 500)

const resizeMapView = async () => {
    await stage.resize(210)
    stage.render()
}


// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------
// --------------------------------------------------------------------------------------------

const $$ = (element) => document.querySelector(element)

const menuSidebar = $$(".dashboard-sidebar")
const dashboardBody = $$(".dashboard-body")
const btnMenuSidebar = $$(".dashboard-sidebar-btn-menu")

btnMenuSidebar.onclick = async () => {
    dashboardBody.classList.toggle("dashboard-body-extend")
    menuSidebar.classList.toggle("dashboard-sidebar-active")
    await resizeMapView()
}

window.addEventListener("resize", async () => {
    await resizeMapView()
})