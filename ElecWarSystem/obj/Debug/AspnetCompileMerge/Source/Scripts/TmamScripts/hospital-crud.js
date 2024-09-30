window.onload = function () {
    setHospitalCouter();
    RequestTmamStatus();
}
function IsAllFieldsFilled() {
    var result =
        $("#person-name").val() !== "" &&
        $("#person-rank").val() !== "" &&
        $("#hospital-name").val() !== "" &&
        $("#hospital-date").val() !== "" &&
        $("#diagnosis").val() !== "" &&
        $("#recommendations").val() !== ""
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
        url: window.location.origin + "/Hospital/Create",
        type: "POST",
        async: false,
        data: {
            "HospitalDetails.PersonID": $("#person-name").val(),
            "HospitalDetails.Hospital": $("#hospital-name").val(),
            "HospitalDetails.Diagnosis": $("#diagnosis").val(),
            "HospitalDetails.Recommendations": $("#recommendations").val(),
            "HospitalDetails.DateFrom": $("#hospital-date").val()
        },
        success: function (result) {
            if (result == -1) {
                alert("يوجد خطأ فى تاريخ دخول المستشفى !!");
            }
            else {
                closePop();
                UpdateHospitalsTable();
                IncreaseHospitalCounter();
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
    $("#recommendations").val(null)
}

function UpdateHospitalsTable() {
    $.ajax({
        url: window.location.origin + "/Hospital/GetHospital",
        type: "GET",
        async: false,
        success: function (result) {
            fillHospitalTable(result);
        }
    })
}

function fillHospitalTable(result) {
    $("#hospital-table").empty();
    var tableHead = `
        <thead>
            <th>م</th>
            <th>الرتبة / الدرجة</th>
            <th>الإسم </th>
            <th>المستشفى</th>
            <th>تاريخ دخول المستشفى</th>
            <th>التشخيص الطبى</th>
            <th>التوصيات الممنوحة</th>
            <th></th>
        </thead>`;
    $("#hospital-table").append(tableHead);

    for (var index in result) {
        var tableItem = `
            <tbody style="font-size:14px;">
                <td>${parseInt(index + 1)}</td >
                <td>${result[index]['HospitalDetails']['Person']['Rank']['RankName']}</td>
                <td>${result[index]['HospitalDetails']['Person']['FullName']}</td>
                <td>${result[index]['HospitalDetails']['Hospital']}</td>
                <td>${getDateFormated(result[index]['HospitalDetails']['DateFrom'])}</td>
                <td>${result[index]['HospitalDetails']['Diagnosis']}</td>
                <td>${result[index]['HospitalDetails']['Recommendations']}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteHospital(${result[index]["ID"]})">
                        حذف
                        <span class="glyphicon glyphicon-remove"></span>
                    </button>
                    
                </td>
            </tbody>`;

        $("#hospital-table").append(tableItem);
    }
}

function openHospitalPopup() {
    document.querySelector(".hospital-popup").classList.add("act");
}

function setHospitalCouter() {
    var listOfHospitalNumbers = $("#hospital-counter").text().split("/");
    var currentHospitalCount = parseInt(listOfHospitalNumbers[0]);
    var totalHospitalCount = parseInt(listOfHospitalNumbers[1]);
    if (totalHospitalCount === currentHospitalCount || timeOutCounter) {
        $("#add-hospital-btn").attr('disabled', 'disabled');
    } else {
        $("#add-hospital-btn").removeAttr('disabled');
    }
}

function IncreaseHospitalCounter() {
    var listOfHospitalNumbers = $("#hospital-counter").text().split("/");
    var currentHospitalCount = parseInt(listOfHospitalNumbers[0]);
    var totalHospitalCount = parseInt(listOfHospitalNumbers[1]);
    currentHospitalCount += 1;
    if (totalHospitalCount === currentHospitalCount) {
        $("#add-hospital-btn").attr('disabled', 'disabled');
    }
    var newStr = `${currentHospitalCount} / ${totalHospitalCount}`;
    $("#hospital-counter").text(newStr);
}

function DecreaseHospitalCounter() {
    var listOfhospitalNumbers = $("#hospital-counter").text().split("/");
    var currenthospitalCount = parseInt(listOfhospitalNumbers[0]);
    var totalhospitalCount = parseInt(listOfhospitalNumbers[1]);
    currenthospitalCount -= 1;
    $("#add-hospital-btn").removeAttr('disabled');
    var newStr = `${currenthospitalCount} / ${totalhospitalCount}`;
    $("#hospital-counter").text(newStr);
}
function closePop() {
    document.querySelector(".hospital-popup").classList.remove("act");
}

function deleteHospital(id) {
    $.ajax({
        url: window.location.origin + "/hospital/Delete",
        type: "POST",
        async: false,
        data: {
            "id": id,

        },
        success: function (result) {
            UpdateHospitalsTable();
            DecreaseHospitalCounter();
        }
    })
}