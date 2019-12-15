import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index";

interface IWeatherData {

    id: number;
    temperature: number;
    pressure: number;
    humidity: number;
    time: string;
}

let baseUri: string = "https://voresvejrstation.azurewebsites.net/api/WeatherDatas";

let buttonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("GetAll");
buttonElement.addEventListener("click", ShowAllweatherdata);
let buttonElement_GetId: HTMLButtonElement = <HTMLButtonElement>document.getElementById("GetId");
buttonElement_GetId.addEventListener("click", getId);
let buttonElement_Add: HTMLButtonElement = <HTMLButtonElement>document.getElementById("Add");
buttonElement_Add.addEventListener("click", add);
let buttonElement_Slet: HTMLButtonElement = <HTMLButtonElement>document.getElementById("Slet");
buttonElement_Slet.addEventListener("click", deleteweatherdata);

let outputElement: HTMLDivElement = <HTMLDivElement>document.getElementById("output_1");

function recordToString(weatherdata: IWeatherData): string {
    return "#" + weatherdata.id  + " Temp" + weatherdata.temperature + " Pres" + weatherdata.pressure + " Hum" + weatherdata.humidity + " time" + weatherdata.time;
    
}

function ShowAllweatherdata(): void {
    axios.get<IWeatherData[]>(baseUri)
        .then(function (response: AxiosResponse<IWeatherData[]>): void {

            let result: string = "<tr>";
            
            response.data.forEach((weatherdata: IWeatherData) => {
                result += "<th scope='row'>" + weatherdata.id + "</th>" + "<td>" + weatherdata.temperature + "</td><td>" + weatherdata.pressure + "</td><td>" + weatherdata.humidity + "</td><td>" + weatherdata.time + "</td></tr>";
                
                console.log(weatherdata);
            });
            outputElement.innerHTML = result;
        })
        .catch(function (error: AxiosError): void { // error in GET or in generateSuccess?
            if (error.response) {
                // the request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
                outputElement.innerHTML = error.message;
            } else { // something went wrong in the .then block?
                outputElement.innerHTML = error.message;
            }
        });

}

function getId(): void {
    let inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("Searchbar");
    let outputElement: HTMLDivElement = <HTMLDivElement>document.getElementById("output_2");
    let title: string = inputElement.value;
    let uri: string = baseUri + "/" + title;
    axios.get<IWeatherData>(uri)
        .then((Response: AxiosResponse) => {
            if (Response.status == 200) {

                outputElement.innerHTML = recordToString(Response.data);

            }
            else {
                outputElement.innerHTML = "Der er intet at vise";
            }

        })
        .catch((error: AxiosError) => {
            outputElement.innerHTML = error.code + " " + error.message;
        })

}

function add(): void{
    let addPrice: HTMLInputElement = <HTMLInputElement>document.getElementById("Pris");
    let addGendstand: HTMLInputElement = <HTMLInputElement>document.getElementById("temperature");
    let addpressure: HTMLInputElement = <HTMLInputElement>document.getElementById("pressure");
    let mytime: string = "Auction";
    let myPrice: number = 0;
    let mytemperature: string = addGendstand.value;
    let mypressure: string = "../img/" + addpressure.value;
    let outputElement: HTMLDivElement = <HTMLDivElement>document.getElementById("output_3");
    axios.post<IWeatherData>(baseUri, { temperature: mytemperature, pressure: mypressure, price: myPrice, time: mytime })
    .then((response: AxiosResponse) => {
        let message: string = "response " + response.status + " " + response.statusText;
        outputElement.innerHTML = message;
        console.log(message);
        ShowAllweatherdata();
    })
    .catch((error: AxiosError) => {
        outputElement.innerHTML = error.message;
        console.log(error);
    });

}

function deleteweatherdata(): void {
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("output_4");
    let inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("sletId");
    let id: string = inputElement.value;
    let uri: string = baseUri + "/" + id;
    axios.delete<IWeatherData>(uri)
        .then(function (response: AxiosResponse<IWeatherData>): void {
            // element.innerHTML = generateSuccessHTMLOutput(response);
            // outputHtmlElement.innerHTML = generateHtmlTable(response.data);
            console.log(JSON.stringify(response));
            output.innerHTML = response.status + " " + response.statusText;
            ShowAllweatherdata();
        })
        .catch(function (error: AxiosError): void { // error in GET or in generateSuccess?
            if (error.response) {
                // the request was made and the server responded with a status code
                // that falls out of the range of 2xx
                // https://kapeli.com/cheat_sheets/Axios.docset/Contents/Resources/Documents/index
                output.innerHTML = error.message;
            } else { // something went wrong in the .then block?
                output.innerHTML = error.message;
            }
        });
}