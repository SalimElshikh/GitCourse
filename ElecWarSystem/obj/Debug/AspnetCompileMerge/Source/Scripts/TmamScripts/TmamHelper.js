window.onload = function ()
{
    RequestTmamStatus();
}
function RequestTmamStatus() {
    $.ajax({
        url: window.location.origin + "/Tmam/GetTmamStatus",
        type: "GET",
        async: true,
        success: function (result) {
            console.log(result);
            ShowAlertAccordingToStatus(result);
            console.log("Load!");
        }
    })
}
function ShowAlertAccordingToStatus(status)
{
    $("#alertBox").empty();
    var alertHtml = "";
    if (status["Recieved"]) {
        $(".hide-after-send").attr('hidden', 'hidden');
        alertHtml = `<div class="alert alert-success" role="alert">
                        تم إرسال التمام إلى مركز عمليات 250 و تم تأكيد الإستلام بنجاح !
                    </div>`;
    } else if (status["Submitted"]) {
        $(".hide-after-send").attr('hidden', 'hidden');
        alertHtml = `<div class="alert alert-info" role="alert">
                        تم إرسال التمام إلى مركز عمليات 250 و منتَظَر تأكيد الإستلام
                    </div>`;
    }
    else {
        $(".hide-after-send").removeAttr('hidden');
        alertHtml = `<div class="alert alert-danger" role="alert">
                            إحترس ! لم يتم إرسال التمام حتى الأن
                        </div>`;
    }
    $("#alertBox").append(alertHtml);
}
const timeFrom = new Date(1, 1, 1, 23, 59, 50);
const timeTo = new Date(1, 1, 1, 23, 59, 59);
var timeOutCounter = false

function getDateFormated(date)
{
    date = new Date(parseInt(date.substr(6)));
    var yyyy = date.getFullYear();
    var mm = date.getMonth() + 1;
    var dd = date.getDate();
    if (mm < 10)
        mm = '0' + mm;
    if (dd < 10)
        dd = '0' + dd;

    var dateFormatted = `${yyyy}-${mm}-${dd}`;
    return dateFormatted;
}
function calOut(power) {
    if ($("#existing").val() > power) {
        $("#existing").val(power);
    }
    $("#outdoor").val(power - $("#existing").val());
}

function getTimeInSeconds(date) {
    return (date.getHours() * 60 * 60) + (date.getMinutes() * 60) + date.getSeconds();
}

function timeInRange(timeInSeconds) {
    return (timeInSeconds > getTimeInSeconds(timeFrom) && timeInSeconds < getTimeInSeconds(timeTo));
}

function getTimeRemain(timeInSeconds) {
    var timeRamain = 0;
    var hours = Math.floor(timeInSeconds / (60 * 60));
    timeRamain = timeInSeconds % (60 * 60);
    hours = (hours >= 10) ? hours.toString() : `0${hours}`;
    var minutes = Math.floor(timeRamain / 60);
    minutes = (minutes >= 10) ? minutes.toString() : `0${minutes}`;
    var seconds = timeRamain % 60;
    seconds = (seconds >= 10) ? seconds.toString() : `0${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
}

setInterval(
    function () {
        const d = new Date();
        if (timeInRange(getTimeInSeconds(d))) {
            $("#time").text("00:00:00");
            $(".timeout").attr('readonly', 'readonly');
            $(".timeout-btn").attr('disabled', 'disabled');
            timeOutCounter = true;
        } else {
            $("#time").text(getTimeRemain(getTimeInSeconds(timeFrom) - getTimeInSeconds(d)));
            $(".timeout").removeAttr('readonly');
            $(".timeout-btn").removeAttr('disabled');
            timeOutCounter = false;
        }
    }, 1000);



function calOut(power) {
    var power = parseInt($("#power").val());
    var exsting = parseInt($("#existing").val());
    var outing = power - exsting;
    $("#outdoor").val(outing);
}
function toTmamDetails(pg) {
    var sum = parseInt($("#errand").val()) +
        parseInt($("#vacation").val()) +
        parseInt($("#sick-leave").val()) +
        parseInt($("#prison").val()) +
        parseInt($("#absence").val()) +
        parseInt($("#hospital").val()) +
        parseInt($("#out-of-country").val()) +
        parseInt($("#outdoor-camp").val());
    if (parseInt($("#outdoor").val()) !== sum) {
        alert("خطأ فى تجميع التمام!!!");
    }
    else {
        $.ajax({
            url: window.location.origin + "/Tmam/AddTmamDetail",
            type: "POST",
            async: false,
            data: {
                "IsOfficers": (pg == 1) ? true : false,
                "totalPower": parseInt($("#power").val()),
                "errand": parseInt($("#errand").val()),
                "vacation": parseInt($("#vacation").val()),
                "sickLeave": parseInt($("#sick-leave").val()),
                "prison": parseInt($("#prison").val()),
                "absence": parseInt($("#absence").val()),
                "hospital": parseInt($("#hospital").val()),
                "outOfCountry": parseInt($("#out-of-country").val()),
                "outdoorCamp": parseInt($("#outdoor-camp").val()),
                "Tmam.AltCommanderID": parseInt($("#person-name").val())
            },
            success: function () {
                if (pg == 2) {
                    window.location.href = window.location.origin + "/sickleave/Index";
                }
                else {
                    window.location.href = window.location.origin + "/Tmam/Index?pg=" + (pg + 1);
                }
            }
        })
    }
}

function UpdatePersonComboBox() {
    $.ajax({
        url: window.location.origin + "/Person/GetPersonsOfRank",
        type: "GET",
        async: false,
        data: {
            "rankID": $("#person-rank").val()
        }, success: function (result) {
            $("#person-name").empty();
            $("#person-name").append("<option></option>");
            for (var index in result) {
                var item = `<option value="${result[index]['ID']}">${result[index]['FullName']}</option>`;
                $("#person-name").append(item);
            }
        }
    })
}
function SubmitTmam() {
    $.ajax({
        url: window.location.origin + "/Tmam/SubmiitTmam",
        type: "POST",
        async: false,
        success: function () {
            window.location.href = window.location.origin + "/Tmam/Review"
        }
    })
}




