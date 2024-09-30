window.onload = function () {
    setOutOfCountryCouter();
    RequestTmamStatus();
    numbersE2A();
}

function IsAllFieldsFilled() {
    var result =
        $("#person-name").val() !== "" &&
        $("#person-rank").val() !== "" &&
        $("#country").val() !== "" &&
        $("#purpose").val() !== "" &&
        $("#date-from").val() !== "" &&
        $("#date-to").val() !== ""
    return result;
}

function disableBtn() {
    if (IsAllFieldsFilled()) {
        $(".popup-submit-btn").removeAttr('disabled');
    }
    else {
        $(".popup-submit-btn").attr('disabled', 'disabled');
    }
}

function Add() {
    $.ajax({
        url: window.location.origin + "/OutOfCountry/Create",
        type: "POST",
        async: false,
        data: {
            "outOfCountryDetail.PersonID": $("#person-name").val(),
            "outOfCountryDetail.Country": $("#country").val(),
            "outOfCountryDetail.Puspose": $("#purpose").val(),
            "outOfCountryDetail.DateFrom": $("#date-from").val(),
            "outOfCountryDetail.DateTo": $("#date-to").val()
        },
        success: function (result) {
            if (result == -1) {
                alert("يوجد خطأ فى النواريخ");
            }
            else {
                closePop();
                UpdateOutOfCountriesTable();
                IncreaseOutOfCountryCounter()
                emptyFormField()
            }
        }
    })
}


function emptyFormField() {
    $("#person-name").val(null)
    $("#person-rank").val(null)
    $("#country").val(null)
    $("#purpose").val(null)
    $("#date-from").val(null)
    $("#date-to").val(null)
}

function UpdateOutOfCountriesTable() {
    $.ajax({
        url: window.location.origin + "/outOfCountry/GetOutOfCountries",
        type: "GET",
        async: false,
        success: function (result) {
            fillOutOfCountriesTable(result);
        }
    })
}

function fillOutOfCountriesTable(result) {
    $("#out-of-country-table").empty();

    var tableHead = `
        <thead>
            <th>م</th>
            <th>الرتبة / الدرجة</th>
            <th>الإسم </th>
            <th>جهة السفر</th>
            <th>الغرض من السفر</th>
            <th>المدة من</th>
            <th>المدة إلى</th>
            <th></th>
        </thead>`;
    $("#out-of-country-table").append(tableHead);

    for (var index in result) {
        var tableItem = `
            <tbody style="font-size:14px;">
                <td>${parseInt(index) + 1}</td>
                <td>${result[index]['OutOfCountryDetail']['Person']['Rank']['RankName']}</td>
                <td>${result[index]['OutOfCountryDetail']['Person']['FullName']}</td>
                <td>${result[index]['OutOfCountryDetail']['Country']}</td>
                <td>${result[index]['OutOfCountryDetail']['Puspose']}</td>
                <td>${getDateFormated(result[index]['OutOfCountryDetail']['DateFrom'])}</td>
                <td>${getDateFormated(result[index]['OutOfCountryDetail']['DateTo'])}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteOutOfCountry(${result[index]["ID"]})">
                        حذف
                        <span class="glyphicon glyphicon-remove"></span>
                    </button>
                    
                </td>
            </tbody>`;
        $("#out-of-country-table").append(tableItem);
    }
}

function openOutCountryPopup() {
    document.querySelector(".out-of-country-popup").classList.add("act");
}

function closePop() {
    document.querySelector(".out-of-country-popup").classList.remove("act");
}

function setOutOfCountryCouter() {
    var listOfOutOfCountryNumbers = $("#out-of-country-counter").text().split("/");
    var currentOutOfCountryCount = parseInt(listOfOutOfCountryNumbers[0]);
    var totalOutOfCountryCount = parseInt(listOfOutOfCountryNumbers[1]);
    if (totalOutOfCountryCount === currentOutOfCountryCount || timeOutCounter) {
        $("#add-out-of-country-btn").attr('disabled', 'disabled');
    } else {
        $("#add-out-of-country-btn").removeAttr('disabled');
    }
}

function IncreaseOutOfCountryCounter() {
    var listOfOutOfCountryNumbers = $("#out-of-country-counter").text().split("/");
    var currentOutOfCountryCount = parseInt(listOfOutOfCountryNumbers[0]);
    var totalOutOfCountryCount = parseInt(listOfOutOfCountryNumbers[1]);
    currentOutOfCountryCount += 1;
    if (totalOutOfCountryCount === currentOutOfCountryCount) {
        $("#add-out-of-country-btn").attr('disabled', 'disabled');
    }
    var newStr = `${currentOutOfCountryCount} / ${totalOutOfCountryCount}`;
    $("#out-of-country-counter").text(newStr);
}

function DecreaseOutOfCountryCounter() {
    var listOfOutOfCountryNumbers = $("#out-of-country-counter").text().split("/");
    var currentOutOfCountryCount = parseInt(listOfOutOfCountryNumbers[0]);
    var totalOutOfCountryCount = parseInt(listOfOutOfCountryNumbers[1]);
    currentOutOfCountryCount -= 1;
    $("#add-out-of-country-btn").removeAttr('disabled');
    var newStr = `${currentOutOfCountryCount} / ${totalOutOfCountryCount}`;
    $("#out-of-country-counter").text(newStr);
}



function deleteOutOfCountry(id) {
    $.ajax({
        url: window.location.origin + "/OutOfCountry/Delete",
        type: "POST",
        async: false,
        data: {
            "id": id,
        },
        success: function (result) {
            UpdateOutOfCountriesTable();
            DecreaseOutOfCountryCounter();
        }
    })
}