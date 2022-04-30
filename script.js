var response = null;
var link = 'http://localhost:8080/index.php';
var page = '';
var id;
var nextId = 500021;
var btnModifica = "<button class='btn btn-primary ms-5 modifica' data-bs-toggle='modal' data-bs-target='#modal-modify'>Modifica</button>";
var btnElimina = "<button class='btn btn-danger elimina'>Elimina</button>";

//funzione
function chiamata(url) {
    $.ajax({
        url: url,
        dataType: 'json', //restituisce un oggetto JSON
        success: function (responseData) {
            console.log(responseData);
            response = responseData;
            page = response["page"]["number"];
            console.log(page);
            if (page == 0) {
                $('#Prev').hide();
                $('#first').hide();
            } else {
                $('#Prev').show();
                $('#first').show();
            }
            if (url == response["_links"]["last"]["href"]) {
                $('#last').hide();
                $('#succ').hide();
            } else {
                $('#last').show();
                $('#succ').show();
            }
            $("#page").html("<button type='button' class='btn btn-info'>" + response["page"]["number"] + "</button>");
            displayTable(response["_embedded"]["employees"]);
        }
    });
}

//una volta che la pagina viene caricata, vengono inseriti gli elementi nella tabella
$(document).ready(
    // displayTable(),
    chiamata(link),
);

function displayTable(data) {
    var dipendente;

    $("tbody").html("");

    $.each(data, function (i, value) {
        dipendente += '<tr>';
        dipendente += '<th scope="row">' + value.id + '</th>';
        dipendente += '<td>' + value.firstName + '</td>';
        dipendente += '<td>' + value.lastName + '</td>';
        dipendente += '<td data-id=' + value.id + '>' + btnElimina + btnModifica + '</td>';
        dipendente += '</tr>';
    });
    $("tbody").append(dipendente);

    $(".modifica").click(function () {
        id = $(this).parent().data("id");
    });



    $(".elimina").click(function () {
        id = $(this).parent().data("id");
        $.ajax({
            type: "DELETE",
            url: link + "/" + id,
            success: function () {
                console.log(response);
                chiamata(link + "?page=" + page);
            }
        });
    });
}

$("#aggiungi").click(function () {
    var nome = $("#nome").val();
    var cognome = $("#cognome").val();

    $("#nome").val("");
    $("#cognome").val("");


    $.ajax({
        type: "POST",
        url: link,

        data: JSON.stringify({
            birthDate: "",
            firstName: nome,
            gender: "M",
            hireDate: "",
            lastName: cognome
        }),

        contentType: "application/json",
        dataType: 'json',

        success: function () {
            nextId++;
            var last = response["_links"]["last"]["href"];
            chiamata(last);
        }
    });
});

$("#modifica").click(function () {
    console.log(this);

    var nome = $("#nome-m").val();
    var cognome = $("#cognome-m").val();

    $.ajax({
        type: "PATCH",
        url: "http://localhost:8080/employees/" + id,
        data: JSON.stringify({
            firstName: nome,
            lastName: cognome
        }),
        dataType: "json",
        contentType: "application/json",
        success: function () {
            chiamata(link);
        }
    });

});

//bottone per pagina avanti
$('#succ').click(function () {
    var next = response["_links"]["next"]["href"];
    console.log(next);
    chiamata(next);
});

//bottone per pagina indietro
$('#Prev').click(function () {
    var pre = response["_links"]["prev"]["href"];
    console.log(pre);
    chiamata(pre);
});

//bottone per ultima pagina
$('#last').click(function () {
    var last = response["_links"]["last"]["href"];
    console.log(last);
    chiamata(last);
});

//bottone per prima pagina
$('#first').click(function () {
    var first = response["_links"]["first"]["href"];
    console.log(first);
    chiamata(first);
});