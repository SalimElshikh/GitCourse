window.onload = function () {
    setSickLeaveCouter();
    RequestTmamStatus();
    numbersE2A();
}

function IsAllFieldsFilled() {
    var result =
        $("#person-name").val() !== "" &&
        $("#person-rank").val() !== "" &&
        $("#hospital-name").val() !== "" &&
        $("#hospital-date").val() !== "" &&
        $("#diagnosis").val() !== "" &&
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
        url: window.location.origin + "/SickLeave/Create",
        type: "POST",
        async: false,
        data: {
            "SickLeaveDetail.PersonID": $("#person-name").val(),
            "SickLeaveDetail.Hospital": $("#hospital-name").val(),
            "SickLeaveDetail.HospitalDate": $("#hospital-date").val(),
            "SickLeaveDetail.Diagnosis": $("#diagnosis").val(),
            "SickLeaveDetail.DateFrom": $("#date-from").val(),
            "SickLeaveDetail.DateTo": $("#date-to").val()
        },
        success: function (result) {
            if (result == -1) {
                alert("يوجد خطأ فى تاريخ الأجازة المرضية");
            }
            else {
                closePop();
                UpdateErrandsTable();
                IncreaseSickLeaveCounter()
                emptyFormField()
            }
        }
    })
}


function emptyFormField() {
    $("#person-name").val(null)
    $("#person-rank").val(null)
    $("#hospital-name").val(null)
    $("#hospital-date").val(null)
    $("#diagnosis").val(null)
    $("#date-from").val(null)
    $("#date-to").val(null)
}

function UpdateErrandsTable() {
    $.ajax({
        url: window.location.origin + "/SickLeave/GetSickLeave",
        type: "GET",
        async: false,
        success: function (result) {
            fillSickLeaveTable(result);
        }
    })
}

function fillSickLeaveTable(result) {
    $("#sick-leaves-table").empty();

    var tableHead = `
        <thead>
            <th>م</th>
            <th>الرتبة / الدرجة</th>
            <th>الإسم </th>
            <th>المستشفى</th>
            <th>تاريخ دخول المستشفى</th>
            <th>التشخيص</th>
            <th>بدء الأجازة</th>
            <th>عودة الأجازة</th>
            <th></th>
        </thead>`;
    $("#sick-leaves-table").append(tableHead);

    for (var index in result) {
        var tableItem = `
            <tbody style="font-size:14px;">
                <td>${parseInt(index) + 1}</td>
                <td>${result[index]['SickLeaveDetail']['Person']['Rank']['RankName']}</td>
                <td>${result[index]['SickLeaveDetail']['Person']['FullName']}</td>
                <td>${result[index]['SickLeaveDetail']['Hospital']}</td>
                <td>${getDateFormated(result[index]['SickLeaveDetail']['HospitalDate'])}</td>
                <td>${result[index]['SickLeaveDetail']['Diagnosis']}</td>
                <td>${getDateFormated(result[index]['SickLeaveDetail']['DateFrom'])}</td>
                <td>${getDateFormated(result[index]['SickLeaveDetail']['DateTo'])}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteSickLeave(${result[index]["ID"]})">
                        حذف
                        <span class="glyphicon glyphicon-remove"></span>
                    </button>
                    
                </td>
            </tbody>`;
        $("#sick-leaves-table").append(tableItem);
    }
}

function openSickLevelPopup()
{
    document.querySelector(".sick-leave-popup").classList.add("act");
}


function setSickLeaveCouter() {
    var listOfSickLeaveNumbers = $("#sick-leave-counter").text().split("/");
    var currentSickLeaveCount = parseInt(listOfSickLeaveNumbers[0]);
    var totalSickLeaveCount = parseInt(listOfSickLeaveNumbers[1]);
    if (totalSickLeaveCount === currentSickLeaveCount || timeOutCounter) {
        $("#add-sick-leave-btn").attr('disabled', 'disabled');
    } else {
        $("#add-sick-leave-btn").removeAttr('disabled');
    }
}

function IncreaseSickLeaveCounter() {
    var listOfSickLeaveNumbers = $("#sick-leave-counter").text().split("/");
    var currentSickLeaveCount = parseInt(listOfSickLeaveNumbers[0]);
    var totalSickLeaveCount = parseInt(listOfSickLeaveNumbers[1]);
    currentSickLeaveCount += 1;
    if (totalSickLeaveCount === currentSickLeaveCount) {
        $("#add-sick-leave-btn").attr('disabled', 'disabled');
    }
    var newStr = `${currentSickLeaveCount} / ${totalSickLeaveCount}`;
    $("#sick-leave-counter").text(newStr);
}

function DecreaseSickLeaveCounter() {
    var listOfSickLeaveNumbers = $("#sick-leave-counter").text().split("/");
    var currentSickLeaveCount = parseInt(listOfSickLeaveNumbers[0]);
    var totalSickLeaveCount = parseInt(listOfSickLeaveNumbers[1]);
    currentSickLeaveCount -= 1;
    $("#add-sick-leave-btn").removeAttr('disabled');
    var newStr = `${currentSickLeaveCount} / ${totalSickLeaveCount}`;
    $("#sick-leave-counter").text(newStr);
}

function closePop() {
    document.querySelector(".sick-leave-popup").classList.remove("act");
}

function deleteSickLeave(id) {
    $.ajax({
        url: window.location.origin + "/SickLeave/Delete",
        type: "POST",
        async: false,
        data: {
            "id": id,
        },
        success: function (result) {
            UpdateErrandsTable();
            DecreaseSickLeaveCounter();
        }
    })
    console.log(id);
}