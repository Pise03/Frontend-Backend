var response = null;
var link = 'http://localhost:8080/rest.php';
var page = '';
var id;
var nextId = 500021;
var btnModifica = "<button class='btn btn-primary ms-5 modifica' data-bs-toggle='modal' data-bs-target='#modal-modify'>Modifica</button>";
var btnElimina = "<button class='btn btn-danger elimina'>Elimina</button>";

//funzione
function chiamata(url) {
    $.ajax({
        url: url,
        method: 'GET',
        dataType: 'json', //restituisce un oggetto JSON
        success: function (responseData) {
            console.log(responseData);
            response = responseData;
            page = response['1']["number"];

            console.log(page);

            if (page == 0) {
                $('#Prev').hide();
                $('#first').hide();
            } else {
                $('#Prev').show();
                $('#first').show();
            }
            if (url == response[0]["_links"]["ult"]["href"]) {
                $('#last').hide();
                $('#succ').hide();
            } else {
                $('#last').show();
                $('#succ').show();
            }
            $("#page").html("<button type='button' class='btn btn-info'>" + response[1]["number"] + "</button>");
            displayTable(response["_embedded"]["employees"]);
        }
    });
}

//una volta che la pagina viene caricata, vengono inseriti gli elementi nella tabella
$(document).ready(
    // displayTable(),
    chiamata(link + "?page=0&size=20"),
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
        //per far vedere i nomi nel modal
        for (var i = 0; i < data.length; i++) {
            if (id == data[i].id) {
                $("#nome-m").val(data[i].firstName);
                $("#cognome-m").val(data[i].lastName);
            }
        }
    });



    $(".elimina").click(function () {
        id = $(this).parent().data("id");
        $.ajax({
            type: "DELETE",
            url: link + "?page=" + response['1']['number'] + "&size=20" + '&id=' + id,
            success: function () {
                console.log(response);
                chiamata(link + "?page=" + page + "&size=20");
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
        url: link + "?page=" + response['1']['number'] + "&size=20" + '&nome=' + nome + '&cognome=' + cognome,

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
            var last = response[0]["_links"]["ult"]["href"];
            chiamata(last);
        }
    });
});

$("#modifica").click(function () {


    var nome = $("#nome-m").val();
    var cognome = $("#cognome-m").val();

    $.ajax({
        type: "PUT",
        url: link + "?page="+response['1']['number']+ "&size=20" +'&id=' + id + '&nome=' + nome + '&cognome=' + cognome,

        data: JSON.stringify({
            firstName: nome,
            lastName: cognome
        }),

        dataType: "json",
        contentType: "application/json",

        success: function () {
            console.log("succes");
            chiamata(link + "?page=" + response['1']['number']+ "&size=20");
        }
    });

});

//bottone per pagina avanti
$('#succ').click(function () {
    var next = response[0]["_links"]["succ"]["href"];
    console.log(next);
    chiamata(next);
});

//bottone per pagina indietro
$('#Prev').click(function () {
    var pre = response[0]["_links"]["prece"]["href"];
    console.log(pre);
    chiamata(pre);
});

//bottone per ultima pagina
$('#last').click(function () {
    var last = response[0]["_links"]["ult"]["href"];
    console.log(last);
    chiamata(last);
});

//bottone per prima pagina
$('#first').click(function () {
    var first = response[0]["_links"]["prima"]["href"];
    console.log(first);
    chiamata(first);
});