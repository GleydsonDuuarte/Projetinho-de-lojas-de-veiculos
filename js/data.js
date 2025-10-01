// Dados dos veículos com galerias de imagens
const vehiclesData = [
    {
        id: 1,
        name: "Honda Civic 1.5",
        price: "119.900,00",
        year: "2017/2017",
        km: "157.000",
        image: "images/vehicles/civic-1.5.jpg",
        location: "Rua das Fronteiras N°77",
        category: "sedan",
        gallery: [
            "images/vehicles/civic/civic-1.jpg",
            "images/vehicles/civic/civic-2.jpg",
            "images/vehicles/civic/civic-3.jpg"
        ]
    },
    {
        id: 2,
        name: "Chevrolet Classic LS",
        price: "38.900,00",
        year: "2016",
        km: "70.500",
        image: "images/vehicles/classic-ls.jpg",
        location: "Rua das Fronteiras N°77",
        category: "hatch",
        gallery: [
            "images/vehicles/classic/classic-1.jpg",
            "images/vehicles/classic/classic-2.jpg",
            "images/vehicles/classic/classic-3.jpg"
        ]
    },
    {
        id: 3,
        name: "Fiat Mobi Like",
        price: "39.990,00",
        year: "2017/2018",
        km: "69.000",
        image: "images/vehicles/mobi-like.jpg",
        location: "Rua das Fronteiras N°77",
        category: "hatch",
        gallery: [
            "images/vehicles/mobi/mobi-1.jpg",
            "images/vehicles/mobi/mobi-2.jpg",
            "images/vehicles/mobi/mobi-3.jpg"
        ]
    },
    {
        id: 4,
        name: "Fiat Uno 1.4",
        price: "38.990,00",
        year: "2012",
        km: "111.000",
        image: "images/vehicles/uno-1.4.jpg",
        location: "Rua das Fronteiras N°77",
        category: "hatch",
        gallery: [
            "images/vehicles/uno/uno-1.jpg",
            "images/vehicles/uno/uno-2.jpg",
            "images/vehicles/uno/uno-3.jpg"
        ]
    },
    {
        id: 5,
        name: "Toyota Hilux 2.8 D",
        price: "189.900,00",
        year: "2020/2020",
        km: "153.000",
        image: "images/vehicles/hilux-2.8d.jpg",
        location: "Rua das Fronteiras N°77",
        category: "pickup",
        gallery: [
            "images/vehicles/hilux/hilux-1.jpg",
            "images/vehicles/hilux/hilux-2.jpg",
            "images/vehicles/hilux/hilux-3.jpg",
            "images/vehicles/hilux/hilux-4.jpg"
        ]
    },
    {
        id: 6,
        name: "Fiat Toro Freedom",
        price: "99.900,00",
        year: "2019",
        km: "169.000",
        image: "images/vehicles/toro-freedom.jpg",
        location: "Rua das Fronteiras N°77",
        category: "pickup",
        features: ["4x4"],
        gallery: [
            "images/vehicles/toro/toro-1.jpg",
            "images/vehicles/toro/toro-2.jpg",
            "images/vehicles/toro/toro-3.jpg"
        ]
    },
    {
        id: 7,
        name: "Renault Master Ex.",
        price: "149.900,00",
        year: "2015",
        km: "202.000",
        image: "images/vehicles/master-ex.jpg",
        location: "Rua das Fronteiras N°77",
        category: "van",
        gallery: [
            "images/vehicles/master/master-1.jpg",
            "images/vehicles/master/master-2.jpg",
            "images/vehicles/master/master-3.jpg"
        ]
    }
];

// Informações da concessionária
const dealershipInfo = {
    name: "Caucaia Autos",
    address: "Rua das Fronteiras N°77, Caucaia - CE",
    phones: ["(85) 99281-3532", "(85) 98871-3235"],
    workingHours: {
        weekdays: "Segunda a Sexta: 8h às 18h",
        saturday: "Sábado: 8h às 12h"
    },
    yearsOfExperience: 26,
    services: ["Compra", "Venda", "Troca", "Financia"]
};