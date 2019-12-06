import axios, {
    AxiosResponse,
    AxiosError
} from "../../node_modules/axios/index";

interface ICoins {

    id: number;
    genstand: string;
    imgPath: string;
    offer: number;
    name: string;
}

let baseUri: string = "https://restcoinserviceeksame.azurewebsites.net/api/Coins";

let buttonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("GetAll");
buttonElement.addEventListener("click", ShowAllCoins);
let buttonElement_GetId: HTMLButtonElement = <HTMLButtonElement>document.getElementById("GetId");
buttonElement_GetId.addEventListener("click", getId);
let buttonElement_Add: HTMLButtonElement = <HTMLButtonElement>document.getElementById("Add");
buttonElement_Add.addEventListener("click", add);
let buttonElement_Slet: HTMLButtonElement = <HTMLButtonElement>document.getElementById("Slet");
buttonElement_Slet.addEventListener("click", deleteCoin);

let outputElement: HTMLDivElement = <HTMLDivElement>document.getElementById("output_1");

function recordToString(coins: ICoins): string {
    return "<img src='" + coins.imgPath + "' Width='50' Height='50'/>" + " " + coins.id + " " + coins.genstand + " " + coins.offer + " " + coins.name;
}

function ShowAllCoins(): void {
    axios.get<ICoins[]>(baseUri)
        .then(function (response: AxiosResponse<ICoins[]>): void {

            let result: string = "<tr>";
            response.data.forEach((coin: ICoins) => {
                result += "<th scope='row'>" + "<img class='img-responsive' src='" + coin.imgPath + "' /></th>" + "<td>" + coin.id + "</td><td>" + coin.genstand + "</td><td>" + coin.offer + "$</td><td>" + coin.name + "</td></tr>";
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
    axios.get<ICoins>(uri)
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
    let addGendstand: HTMLInputElement = <HTMLInputElement>document.getElementById("Genstand");
    let addImgPath: HTMLInputElement = <HTMLInputElement>document.getElementById("imgPath");
    let myName: string = "Auction";
    let myPrice: number = 0;
    let myGenstand: string = addGendstand.value;
    let myImgPath: string = "../img/" + addImgPath.value;
    let outputElement: HTMLDivElement = <HTMLDivElement>document.getElementById("output_3");
    axios.post<ICoins>(baseUri, { genstand: myGenstand, imgpath: myImgPath, price: myPrice, name: myName })
    .then((response: AxiosResponse) => {
        let message: string = "response " + response.status + " " + response.statusText;
        outputElement.innerHTML = message;
        console.log(message);
        ShowAllCoins();
    })
    .catch((error: AxiosError) => {
        outputElement.innerHTML = error.message;
        console.log(error);
    });

}

function deleteCoin(): void {
    let output: HTMLDivElement = <HTMLDivElement>document.getElementById("output_4");
    let inputElement: HTMLInputElement = <HTMLInputElement>document.getElementById("sletId");
    let id: string = inputElement.value;
    let uri: string = baseUri + "/" + id;
    axios.delete<ICoins>(uri)
        .then(function (response: AxiosResponse<ICoins>): void {
            // element.innerHTML = generateSuccessHTMLOutput(response);
            // outputHtmlElement.innerHTML = generateHtmlTable(response.data);
            console.log(JSON.stringify(response));
            output.innerHTML = response.status + " " + response.statusText;
            ShowAllCoins();
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