function preventBack() {
    window.history.forward();
}

setTimeout("preventBack()", 0);
window.onunload = function () { null }

function openDetailsEmail(id)
{
    window.location.href = "Details/" + id;
}

function SelectAllUnits()
{
    if ($('#select-all-ch').is(":checked"))
    {

    }
    else
    {

    }
}
$("#select-all-ch").click(function () {
    
});
function getDateFormated(date) {
    console.log(date);
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

function loadExportedEmails(exported = false) {
    if (exported) {
        $("#exportBtn").attr("class", "btn btn-block btn-primary");
        $("#importBtn").attr("class", "btn btn-block btn-default");
    } else {
        $("#importBtn").attr("class", "btn btn-block btn-primary");
        $("#exportBtn").attr("class", "btn btn-block btn-default");
    }
    $.ajax({
        url: "GetEmails",
        type: "GET",
        async: true,
        data: {
            "export": exported,
        },
        success: function (result) {
            //Make Header
            $("#emailsListHeader").empty();
            var ListHeaderMarkup = "";
            ListHeaderMarkup +=
                "<div class='row'>"
            if (!exported) {
                ListHeaderMarkup +=
                    "<div class='col-lg-1 col-md-1 col-sm-1'>هام</div>"
                    + "<div class='col-lg-3 col-md-3 col-sm-3'>المرسل</div>"
            }
            ListHeaderMarkup +=
                "<div class='col-lg-6 col-md-6 col-sm-6'>الموضوع</div>"
                + "<div class='col-lg-2 col-md-2 col-sm-2'>الوقت</div></div>"
            $("#emailsListHeader").append(ListHeaderMarkup);

            //EmailsDiv
            $("#EmailsDiv").empty();
            var EmailsDivMarkup = "";
            for (var item in result) {
                if (!exported) {
                    var ch = result[item]['Starred'] ? 'checked' : '';
                    var fontStyle = result[item]['Readed'] ? 'normal' : 'bold';
                    var date = new Date(parseInt(result[item]['Email']['SendDateTime'].substr(6)));
                    EmailsDivMarkup = ""
                    EmailsDivMarkup +=
                        `<div class='container mt-2 p-3 email-item'>
                            <div class='row'>
                                <div class='col-lg-1 col-md-1 col-sm-1'
                                    id='${result[item]['Email']['ID']}'>
                                    <input type='checkbox' ${ch}/>
                                </div>
                                
                                <div class='col-lg-3 col-md-3 col-sm-3'
                                    style="font-weight:${fontStyle};" 
                                    id='${result[item]['Email']['ID']}' 
                                    onclick='openDetailsEmail(${result[item]['Email']['ID']})'>
                                    ${result[item]['Email']['Sender']['UnitName']}
                                </div>
                                <div class='col-lg-6 col-md-6 col-sm-6'
                                    style="font-weight:${fontStyle};" 
                                    id='${result[item]['Email']['ID']}' 
                                    onclick='openDetailsEmail(${result[item]['Email']['ID']})'>
                                    ${result[item]['Email']['Subject']} - ${result[item]['Email']['EmailText']}
                                </div>
                                <div class='col-lg-2 col-md-2 col-sm-2'
                                    style="font-weight:${fontStyle};" 
                                    id='${result[item]['Email']['ID']}' 
                                    onclick='openDetailsEmail(${result[item]['Email']['ID']})'>
                                    ${getDateFormated(date)}
                                </div>
                            </div>
                        </div>`;
                } else {
                    var date = new Date(parseInt(result[item]['SendDateTime'].substr(6)));

                    EmailsDivMarkup = ""
                    EmailsDivMarkup +=
                        `<div class='container mt-2 p-3 email-item'  onclick='openDetailsEmail(${result[item]['ID']})'>
                            <div class='row'>
                                <div class='col-lg-7 col-md-7 col-sm-7'
                                    id='${result[item]['ID']}'>
                                    ${result[item]['Subject']} , ${result[item]['EmailText']}
                                </div>
                                <div class='col-lg-2 col-md-2 col-sm-2'
                                    id='${result[item]['ID']}'>
                                    ${getDateFormated(date)}
                                </div>
                            </div>
                        </div>`;
                }
                $("#EmailsDiv").append(EmailsDivMarkup);
            }
        }
    })
}

function StarEmail(id) {
    $.ajax({
        url: "StarEmail",
        type: "POST",
        async: true,
        data: {
            "id": id,
        }
    })
}

function DownloadFile(id) {
    window.location.href = window.location.origin + "/Document/Download/" + id;
}
