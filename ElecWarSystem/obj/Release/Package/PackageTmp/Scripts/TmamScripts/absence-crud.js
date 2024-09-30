window.onload = function ()
{    
    setAbsenceCouter();
    RequestTmamStatus();
    numbersE2A();
}

function IsAllFieldsFilled() {
    var result =
        $("#person-name").val() !== "" &&
        $("#person-rank").val() !== "" &&
        $("#absence-times").val() !== "" &&
        $("#date-from").val() !== "" &&
        $("#command-number").val() !== "" &&
        $("#command-date").val() !== ""
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
        url: window.location.origin + "/Absence/Create",
        type: "POST",
        async: false,
        data: {
            "AbsenceDetail.PersonID": $("#person-name").val(),
            "AbsenceDetail.AbsenceTimes": parseInt($("#absence-times").val()),
            "AbsenceDetail.DateFrom": $("#date-from").val(),
            "AbsenceDetail.commandItem.Number": $("#command-number").val(),
            "AbsenceDetail.commandItem.Date": $("#command-date").val(),
        },
        success: function (result) {
            if (result == -1) {
                alert("يوجد خطأ فى تاريخ الأجازة");
            }
            else {
                closePop();
                UpdateAbsencesTable();
                IncreaseAbsenceCounter()
                emptyFormField()
            }
        }
    })
}

function emptyFormField()
{
    $("#person-name").val(null)
    $("#person-rank").val(null)
    $("#absence-times").val(null)
    $("#date-from").val(null)
    $("#command-number").val(null)
    $("#command-date").val(null)
}

function UpdateAbsencesTable() {
    $.ajax({
        url: window.location.origin + "/Absence/GetAbsences",
        type: "GET",
        async: false,
        success: function (result) {
            fillAbsenceTable(result);
        }
    })
}

function fillAbsenceTable(result) {
    $("#absence-table").empty();

    var tableHead = `
        <thead>
            <th>م</th>
            <th>الرتبة / الدرجة</th>
            <th>الإسم </th>
            <th>التاريخ الغياب</th>
            <th>دفعة الغياب</th>
            <th colspan="2">بند الأوامر</th>
            <th></th>
        </thead>`;
    $("#absence-table").append(tableHead);

    for (var index in result) {
        var tableItem = `
            <tbody style="font-size:14px;">
                <td>${parseInt(index) + 1}</td>
                <td>${result[index]['AbsenceDetail']['Person']['Rank']['RankName']}</td>
                <td>${result[index]['AbsenceDetail']['Person']['FullName']}</td>
                <td>${getDateFormated(result[index]['AbsenceDetail']['DateFrom'])}</td>
                <td>${result[index]['AbsenceDetail']['AbsenceTimes']}</td>
                <td>${result[index]['AbsenceDetail']['commandItem']['Number']}</td>
                <td>${getDateFormated(result[index]['AbsenceDetail']['commandItem']['Date'])}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteAbsence(${result[index]["ID"]})">
                        حذف
                        <span class="glyphicon glyphicon-remove"></span>
                    </button>
                    
                </td>
            </tbody>`;
        $("#absence-table").append(tableItem);
    }
}

function openAbsencePopup() {
    document.querySelector(".absence-popup").classList.add("act");
}


function setAbsenceCouter() {
    var listOfAbsenceNumbers = $("#absence-counter").text().split("/");
    var currentAbsenceCount = parseInt(listOfAbsenceNumbers[0]);
    var totalAbsenceCount = parseInt(listOfAbsenceNumbers[1]);
    if (totalAbsenceCount === currentAbsenceCount || timeOutCounter) {
        $("#add-absence-btn").attr('disabled', 'disabled');
    } else {
        $("#add-absence-btn").removeAttr('disabled');
    }
}

function IncreaseAbsenceCounter() {
    var listOfAbsenceNumbers = $("#absence-counter").text().split("/");
    var currentAbsenceCount = parseInt(listOfAbsenceNumbers[0]);
    var totalAbsenceCount = parseInt(listOfAbsenceNumbers[1]);
    currentAbsenceCount += 1;
    if (totalAbsenceCount === currentAbsenceCount) {
        $("#add-absence-btn").attr('disabled', 'disabled');
    }
    var newStr = `${currentAbsenceCount} / ${totalAbsenceCount}`;
    $("#absence-counter").text(newStr);
}

function DecreaseAbsenceCounter() {
    var listOfAbsenceNumbers = $("#absence-counter").text().split("/");
    var currentAbsenceCount = parseInt(listOfAbsenceNumbers[0]);
    var totalAbsenceCount = parseInt(listOfAbsenceNumbers[1]);
    currentAbsenceCount -= 1;
    $("#add-absence-btn").removeAttr('disabled');
    var newStr = `${currentAbsenceCount} / ${totalAbsenceCount}`;
    $("#absence-counter").text(newStr);
}

function closePop() {
    document.querySelector(".absence-popup").classList.remove("act");
}

function deleteAbsence(id) {
    $.ajax({
        url: window.location.origin + "/Absence/Delete",
        type: "POST",
        async: false,
        data: {
            "AbsenceID": id,
        },
        success: function (result) {
            UpdateAbsencesTable();
            DecreaseAbsenceCounter();
        }
    })
    console.log(id);
}