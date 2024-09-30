window.onload = function () {
    setSickLeaveCouter();
    RequestTmamStatus();
}



function IsAllFieldsFilled() {
    var result =
        $("#person-name").val() !== "" &&
        $("#person-rank").val() !== "" &&
        $("#errand-place").val() !== "" &&
        $("#errand-commandor").val() !== "" &&
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
        url: window.location.origin + "/Errand/Create",
        type: "POST",
        async: false,
        data: {
            "ErrandDetail.PersonID": $("#person-name").val(),
            "ErrandDetail.ErrandPlace": $("#errand-place").val(),
            "ErrandDetail.ErrandCommandor": $("#errand-commandor").val(),
            "ErrandDetail.DateFrom": $("#date-from").val(),
            "ErrandDetail.DateTo": $("#date-to").val()
        },
        success: function (result) {
            if (result == -1) {
                alert("يوجد خطأ فى تاريخ المأموريات");
            }
            else {
                closePop();
                UpdateErrandsTable();
                IncreaseErrandCounter();
                emptyFormField()
            }
        }
    })
}

function emptyFormField() {
    $("#person-name").val(null)
    $("#person-rank").val(null)
    $("#errand-place").val(null)
    $("#errand-commandor").val(null)
    $("#date-from").val(null)
    $("#date-to").val(null)
}

function UpdateErrandsTable() {
    $.ajax({
        url: window.location.origin + "/Errand/GetErrands",
        type: "GET",
        async: false,
        success: function (result) {
            fillSickLeaveTable(result);
        }
    })
}

function fillSickLeaveTable(result) {
    $("#errand-table").empty();
    var tableHead = `
        <thead>
            <th>م</th>
            <th>الرتبة / الدرجة</th>
            <th>الإسم </th>
            <th>جهة المأمورية</th>
            <th>الأمر بالمأمورية</th>
            <th>التاريخ من</th>
            <th>التاريخ إلى</th>
            <th></th>
        </thead>`;
    $("#errand-table").append(tableHead);

    for (var index in result) {
        var tableItem = `
            <tbody style="font-size:14px;">
                <td>${parseInt(index + 1)}</td >
                <td>${result[index]['ErrandDetail']['Person']['Rank']['RankName']}</td>
                <td>${result[index]['ErrandDetail']['Person']['FullName']}</td>
                <td>${result[index]['ErrandDetail']['ErrandPlace']}</td>
                <td>${result[index]['ErrandDetail']['ErrandCommandor']}</td>
                <td>${getDateFormated(result[index]['ErrandDetail']['DateFrom'])}</td>
                <td>${getDateFormated(result[index]['ErrandDetail']['DateTo'])}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteErrand(${result[index]["ID"]})">
                        حذف
                        <span class="glyphicon glyphicon-remove"></span>
                    </button>
                    
                </td>
            </tbody>`;

        $("#errand-table").append(tableItem);
    }
}

function openErrandPopup() {
    document.querySelector(".errand-popup").classList.add("act");
}

function setSickLeaveCouter() {
    var listOfErrandNumbers = $("#errand-counter").text().split("/");
    var currentErrandCount = parseInt(listOfErrandNumbers[0]);
    var totalErrandCount = parseInt(listOfErrandNumbers[1]);
    if (totalErrandCount === currentErrandCount || timeOutCounter) {
        $("#add-errand-btn").attr('disabled', 'disabled');
    } else {
        $("#add-errand-btn").removeAttr('disabled');
    }
}

function IncreaseErrandCounter() {
    var listOfErrandNumbers = $("#errand-counter").text().split("/");
    var currentErrandCount = parseInt(listOfErrandNumbers[0]);
    var totalErrandCount = parseInt(listOfErrandNumbers[1]);
    currentErrandCount += 1;
    if (totalErrandCount === currentErrandCount) {
        $("#add-errand-btn").attr('disabled', 'disabled');
    }
    var newStr = `${currentErrandCount} / ${totalErrandCount}`;
    $("#errand-counter").text(newStr);
}

function DecreaseSickLeaveCounter() {
    var listOfErrandNumbers = $("#errand-counter").text().split("/");
    var currentErrandCount = parseInt(listOfErrandNumbers[0]);
    var totalErrandCount = parseInt(listOfErrandNumbers[1]);
    currentErrandCount -= 1;
    $("#add-errand-btn").removeAttr('disabled');
    var newStr = `${currentErrandCount} / ${totalErrandCount}`;
    $("#errand-counter").text(newStr);
}
function closePop() {
    document.querySelector(".errand-popup").classList.remove("act");
}

function deleteErrand(id) {
    $.ajax({
        url: window.location.origin + "/Errand/Delete",
        type: "POST",
        async: false,
        data: {
            "errandID": id,

        },
        success: function (result) {
            UpdateErrandsTable();
            DecreaseSickLeaveCounter();
        }
    })
}