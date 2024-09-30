window.onload = function () {
    setVacationCouter();
    RequestTmamStatus();
}

function IsAllFieldsFilled() {
    var result =
        $("#person-name").val() !== "" &&
        $("#person-rank").val() !== "" &&
        $("#vacation-type").val() !== "" &&
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
        url: window.location.origin + "/Vacation/Create",
        type: "POST",
        async: false,
        data: {
            "VacationDetail.PersonID": $("#person-name").val(),
            "VacationDetail.VacationType": $("#vacation-type").val(),
            "VacationDetail.DateFrom": $("#date-from").val(),
            "VacationDetail.DateTo": $("#date-to").val()
        },
        success: function (result) {
            if (result == -1) {
                alert("يوجد خطأ فى تاريخ الأجازة");
            }
            else {
                closePop();
                UpdateVacationsTable();
                IncreaseVacationCounter()
                emptyFormField()
            }
        }
    })
}

function emptyFormField() {
    $("#person-name").val(null)
    $("#person-rank").val(null)
    $("#vacation-type").val(null)
    $("#date-from").val(null)
    $("#date-to").val(null)
}

function UpdateVacationsTable() {
    $.ajax({
        url: window.location.origin + "/Vacation/GetVacation",
        type: "GET",
        async: false,
        success: function (result) {
            fillVacationTable(result);
        }
    })
}

function fillVacationTable(result) {
    $("#vacations-table").empty();

    var tableHead = `
        <thead>
            <th>م</th>
            <th>الرتبة / الدرجة</th>
            <th>الإسم </th>
            <th>نوع الأجازة</th>
            <th>بدء الأجازة</th>
            <th>عودة الأجازة</th>
            <th></th>
        </thead>`;
    $("#vacations-table").append(tableHead);

    for (var index in result) {
        var tableItem = `
            <tbody style="font-size:14px;">
                <td>${parseInt(index + 1)}</td >
                <td>${result[index]['VacationDetail']['Person']['Rank']['RankName']}</td>
                <td>${result[index]['VacationDetail']['Person']['FullName']}</td>
                <td>${result[index]['VacationDetail']['VacationType']}</td>
                <td>${getDateFormated(result[index]['VacationDetail']['DateFrom'])}</td>
                <td>${getDateFormated(result[index]['VacationDetail']['DateTo'])}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteVacation(${result[index]["ID"]})">
                        حذف
                        <span class="glyphicon glyphicon-remove"></span>
                    </button>
                    
                </td>
            </tbody>`;
        $("#vacations-table").append(tableItem);
    }
}

function openVacationPopup() {
    document.querySelector(".vacation-popup").classList.add("act");
}


function setVacationCouter() {
    var listOfVacationNumbers = $("#vacation-counter").text().split("/");
    var currentVacationCount = parseInt(listOfVacationNumbers[0]);
    var totalVacationCount = parseInt(listOfVacationNumbers[1]);
    if (totalVacationCount === currentVacationCount || timeOutCounter) {
        $("#add-vacation-btn").attr('disabled', 'disabled');
    } else {
        $("#add-vacation-btn").removeAttr('disabled');
    }
}

function IncreaseVacationCounter() {
    var listOfVacationNumbers = $("#vacation-counter").text().split("/");
    var currentVacationCount = parseInt(listOfVacationNumbers[0]);
    var totalVacationCount = parseInt(listOfVacationNumbers[1]);
    currentVacationCount += 1;
    if (totalVacationCount === currentVacationCount) {
        $("#add-vacation-btn").attr('disabled', 'disabled');
    }
    var newStr = `${currentVacationCount} / ${totalVacationCount}`;
    $("#vacation-counter").text(newStr);
}

function DecreaseVacationCounter() {
    var listOfVacationNumbers = $("#vacation-counter").text().split("/");
    var currentVacationCount = parseInt(listOfVacationNumbers[0]);
    var totalVacationCount = parseInt(listOfVacationNumbers[1]);
    currentVacationCount -= 1;
    $("#add-vacation-btn").removeAttr('disabled');
    var newStr = `${currentVacationCount} / ${totalVacationCount}`;
    $("#vacation-counter").text(newStr);
}

function closePop() {
    document.querySelector(".vacation-popup").classList.remove("act");
}

function deleteVacation(id) {
    $.ajax({
        url: window.location.origin + "/Vacation/Delete",
        type: "POST",
        async: false,
        data: {
            "VacationID": id,
        },
        success: function (result) {
            UpdateVacationsTable();
            DecreaseVacationCounter();
        }
    })
    console.log(id);
}