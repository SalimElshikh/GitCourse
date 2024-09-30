window.onload = function () {
    setCampCouter();
    RequestTmamStatus();
    numbersE2A();
}

function IsAllFieldsFilled() {
    var result =
        $("#person-name").val() !== "" &&
        $("#person-rank").val() !== "" &&
        $("#currentExistance").val() !== "" &&
        $("#reason").val() !== "" &&
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
        url: window.location.origin + "/Camp/Create",
        type: "POST",
        async: false,
        data: {
            "CampDetail.PersonID": $("#person-name").val(),
            "CampDetail.CurrentExistance": $("#currentExistance").val(),
            "CampDetail.Reason": $("#reason").val(),
            "CampDetail.DateFrom": $("#date-from").val(),
            "CampDetail.DateTo": $("#date-to").val()
        },
        success: function (result) {
            if (result == -1) {
                alert("يوجد خطأ فى النواريخ");
            }
            else {
                closePop();
                UpdateCampsTable();
                IncreaseCampCounter()
                emptyFormField()
            }
        }
    })
}


function emptyFormField() {
    $("#person-name").val(null)
    $("#person-rank").val(null)
    $("#currentExistance").val(null)
    $("#reason").val(null)
    $("#date-from").val(null)
    $("#date-to").val(null)
}

function UpdateCampsTable() {
    $.ajax({
        url: window.location.origin + "/Camp/GetCamps",
        type: "GET",
        async: false,
        success: function (result) {
            fillCampsTable(result);
        }
    })
}

function fillCampsTable(result) {
    $("#camp-table").empty();

    var tableHead = `
        <thead>
            <th>م</th>
            <th>الرتبة / الدرجة</th>
            <th>الإسم </th>
            <th>مكان التمركز الحالى</th>
            <th>السبب</th>
            <th>المدة من</th>
            <th>المدة إلى</th>
            <th></th>
        </thead>`;
    $("#camp-table").append(tableHead);

    for (var index in result) {
        var tableItem = `
            <tbody style="font-size:14px;">
                <td>${parseInt(index) + 1}</td>
                <td>${result[index]['CampDetail']['Person']['Rank']['RankName']}</td>
                <td>${result[index]['CampDetail']['Person']['FullName']}</td>
                <td>${result[index]['CampDetail']['CurrentExistance']}</td>
                <td>${result[index]['CampDetail']['Reason']}</td>
                <td>${getDateFormated(result[index]['CampDetail']['DateFrom'])}</td>
                <td>${getDateFormated(result[index]['CampDetail']['DateTo'])}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteCamp(${result[index]["ID"]})">
                        حذف
                        <span class="glyphicon glyphicon-remove"></span>
                    </button>
                    
                </td>
            </tbody>`;
        $("#camp-table").append(tableItem);
    }
}

function openCampPopup() {
    document.querySelector(".camp-popup").classList.add("act");
}

function closePop() {
    document.querySelector(".camp-popup").classList.remove("act");
}

function setCampCouter() {
    var listOfCampNumbers = $("#camp-counter").text().split("/");
    var currentCampCount = parseInt(listOfCampNumbers[0]);
    var totalCampCount = parseInt(listOfCampNumbers[1]);
    if (totalCampCount === currentCampCount || timeOutCounter) {
        $("#add-camp-btn").attr('disabled', 'disabled');
    } else {
        $("#add-camp-btn").removeAttr('disabled');
    }
}

function IncreaseCampCounter() {
    var listOfCampNumbers = $("#camp-counter").text().split("/");
    var currentCampCount = parseInt(listOfCampNumbers[0]);
    var totalCampCount = parseInt(listOfCampNumbers[1]);
    currentCampCount += 1;
    if (totalCampCount === currentCampCount) {
        $("#add-camp-btn").attr('disabled', 'disabled');
    }
    var newStr = `${currentCampCount} / ${totalCampCount}`;
    $("#camp-counter").text(newStr);
}

function DecreaseCampCounter() {
    var listOfCampNumbers = $("#camp-counter").text().split("/");
    var currentCampCount = parseInt(listOfCampNumbers[0]);
    var totalCampCount = parseInt(listOfCampNumbers[1]);
    currentCampCount -= 1;
    $("#add-camp-btn").removeAttr('disabled');
    var newStr = `${currentCampCount} / ${totalCampCount}`;
    $("#camp-counter").text(newStr);
}



function deleteCamp(id) {
    $.ajax({
        url: window.location.origin + "/Camp/Delete",
        type: "POST",
        async: false,
        data: {
            "id": id,
        },
        success: function (result) {
            UpdateCampsTable();
            DecreaseCampCounter();
        }
    })
}