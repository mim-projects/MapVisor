namespace MauiApp1 {
    public partial class MainPage : ContentPage {
        public MainPage() {
            InitializeComponent();
            
            var htmlFile = new StreamReader(FileSystem.OpenAppPackageFileAsync("VisorMap/index.html").Result).ReadToEnd();
            // Library Map Visor
            htmlFile = htmlFile?.Replace("#{mapVisorCSS}", new StreamReader(FileSystem.OpenAppPackageFileAsync("VisorMap/css/map-visor.css").Result).ReadToEnd());
            htmlFile = htmlFile?.Replace("#{mapVisorJS}", new StreamReader(FileSystem.OpenAppPackageFileAsync("VisorMap/js/async-map-visor.js").Result).ReadToEnd());
            // Custom Files
            htmlFile = htmlFile?.Replace("#{styleCSS}", new StreamReader(FileSystem.OpenAppPackageFileAsync("VisorMap/css/style.css").Result).ReadToEnd());
            htmlFile = htmlFile?.Replace("#{endHead}", new StreamReader(FileSystem.OpenAppPackageFileAsync("VisorMap/js/index.js").Result).ReadToEnd());
            // Custom Variables
            htmlFile = htmlFile?.Replace("#{API_SERVER}", "https://da-nang.fr-1.paas.massivegrid.net/dc3BackEnd2/webresources/");
            htmlFile = htmlFile?.Replace("#{WEB_SOCKET}", "wss://da-nang.fr-1.paas.massivegrid.net/dc3BackEnd2/webservices/map/visor/");
            htmlFile = htmlFile?.Replace("#{IMAGE_SERVER}", "https://dc3-2020-pachuca.jl.serv.net.mx/dc3BackEnd2/webresources/com.mim.entities.permisotrabajo/image/");
            // ---
            htmlFile = htmlFile?.Replace("#{cc.attrs.plant}", "danang");
            htmlFile = htmlFile?.Replace("#{cc.attrs.debug}", "false");
            htmlFile = htmlFile?.Replace("#{cc.attrs.sizeControlBtn}", "1.25rem");
            // ---
            htmlFile = htmlFile?.Replace("#{cc.attrs.background}", "whitesmoke");
            htmlFile = htmlFile?.Replace("#{cc.attrs.primaryColor500}", "#6ebc3b");
            htmlFile = htmlFile?.Replace("#{cc.attrs.primaryColor400}", "#8ac960");
            htmlFile = htmlFile?.Replace("#{cc.attrs.textColor}", "white");
            htmlFile = htmlFile?.Replace("#{cc.attrs.textColorInput}", "black");
            // ---
            htmlFile = htmlFile?.Replace("#{bundle.loading}", "Loading");
            htmlFile = htmlFile?.Replace("#{bundle.error}", "Error");
            htmlFile = htmlFile?.Replace("#{bundle.filter}", "Filter");
            htmlFile = htmlFile?.Replace("#{bundle.information}", "Information");
            htmlFile = htmlFile?.Replace("#{bundle.signed_first}", "Signed At First");
            htmlFile = htmlFile?.Replace("#{bundle.not_signed_first}", "Not Signed At First");
            htmlFile = htmlFile?.Replace("#{bundle.complete}", "Complete");
            htmlFile = htmlFile?.Replace("#{bundle.amount_personal}", "Amount Personal");
            htmlFile = htmlFile?.Replace("#{bundle.help}", "Help");
            htmlFile = htmlFile?.Replace("#{bundle.simbology}", "Simbology");
            htmlFile = htmlFile?.Replace("#{bundle.activity_type}", "Activity Type");
            htmlFile = htmlFile?.Replace("#{bundle.cutting_welding_work}", "Cutting and welding work");
            htmlFile = htmlFile?.Replace("#{bundle.lines_with_fluids}", "Lines with Fluids");
            htmlFile = htmlFile?.Replace("#{bundle.electrical_work}", "Electrical work | Electrical");
            htmlFile = htmlFile?.Replace("#{bundle.confined_space}", "Confined space");
            htmlFile = htmlFile?.Replace("#{bundle.height}", "Height");
            htmlFile = htmlFile?.Replace("#{bundle.chemicals_handle}", "Chemicals handle");
            htmlFile = htmlFile?.Replace("#{bundle.other}", "Other");
            htmlFile = htmlFile?.Replace("#{bundle.companies}", "Companies");
            htmlFile = htmlFile?.Replace("#{bundle.areas}", "Areas");
            htmlFile = htmlFile?.Replace("#{bundle.activities}", "Activities");

            WebView.Source = new HtmlWebViewSource {
                Html = htmlFile
            };
        }
    }
}
