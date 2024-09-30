var EditMode, ID, personType;

function disableBtn() {
    if ($("#person-name").val() === "" ||
        $("#person-rank").val() === "" ||
        $("#person-MilID").val() === "") {

        $(".popup-submit-btn").attr('disabled', 'disabled');
    } else {
        $(".popup-submit-btn").removeAttr('disabled');
    }
}
function AddPerson(unitId, type) {
    $.ajax({
        url: window.location.origin + "/Person/Create",
        type: "POST",
        async: false,
        data: {
            "UnitID": unitId,
            "MilID": $("#person-MilID").val(),
            "RankID": $("#person-rank").val(),
            "FullName": $("#person-name").val(),
            "Type": type
        }
    })
    $("#person-MilID").val(null)
    $("#person-rank").val(null)
    $("#person-name").val(null)
    updatePersonTable(type);
}


function EditPerson(id, type) {
    $.ajax({
        url: window.location.origin + "/Person/Edit",
        type: "POST",
        async: false,
        data: {
            "id": id,
            "MilID": $("#person-MilID").val(),
            "RankID": $("#person-rank").val(),
            "FullName": $("#person-name").val(),
            "Type": type
        }
    })
    $("#person-MilID").val(null)
    $("#person-rank").val(null)
    $("#person-name").val(null)
    updatePersonTable(type);
}


function openPersonPopup(id, type, editMode) {
    document.querySelector(".popup").classList.add("act");
    personType = type;
    EditMode = editMode;
    ID = id;
    if (EditMode) {
        $.ajax({
            url: window.location.origin + "/Person/GetPerson",
            type: "GET",
            async: false,
            data: {
                "id": id
            },
            success: function (result) {
                $("#person-MilID").val(result['MilID'])
                $("#person-rank").val(result['RankID'])
                $("#person-name").val(result['FullName'])
                disableBtn();
            }
        })
    } else {

    }
}
function savePersonChanges() {
    console.log(ID, personType);
    if (EditMode) {
        EditPerson(ID, personType);
    } else {
        AddPerson(ID, personType);
    }
    closePop();
}
function closePop() {
    document.querySelector(".popup").classList.remove("act");
    $("#person-MilID").val(null)
    $("#person-rank").val(null)
    $("#person-name").val(null)
}

function updatePersonTable(type) {
    $.ajax({
        url: window.location.origin + "/Person/GetPersons",
        type: "Get",
        async: false,
        data: {
            "type": type,
        },
        success: function (result) {
            FillTable(result, type);
        }
    })
}
function updateAfterDelete(id, type) {
    if (confirm("هل انت متأكد من حذف الشخص ؟")) {
        $.ajax({
            url: window.location.origin + "/Person/Delete",
            type: "POST",
            async: false,
            data: {
                "id": id,
            },
            success: function (result) {
                if (result === "False") {
                    alert("لا يمكنك مسح عنصر من قيادة الوحدة");
                }
                updatePersonTable(type);
            },
            error: function () {
                alert("Failed");
            }
        })
    }
}
function FillTable(result, type) {
    console.log(result);
    $("#persons-table").empty();
    var rank = (type == 1 ? "الرتبة" : "الدرجة")
    var table = `
            <thead>
                <th>م</th>
                <th>الرقم العسكرى</th>
                <th>${rank}</th>
                <th>الإسم</th>
                <th></th>
            </thead> `;
    $("#persons-table").append(table);
    for (var item in result) {
        console.log(result[item]['ID']);
        var tableitem = ` 
                <tbody>
                <tr>
                    <td>${parseInt(item) + 1}</td >
                    <td>${result[item]['MilID']}</td>
                    <td>${result[item]['Rank']['RankName']}</td>
                    <td>${result[item]['FullName']}</td>
                    <td>
                        <button class="btn btn-danger" onclick="updateAfterDelete(${result[item]['ID']}, ${type})">
                            حذف
                            <span class="glyphicon glyphicon-remove"></span>
                        </button>
                        |
                        <button class="btn btn-success"  onclick="openPersonPopup(${result[item]['ID']}, ${type}, ${true})">
                            تعديل
                            <span class="glyphicon glyphicon-edit"></span>
                        </button>
                    </td>
                </tr></tbody>`;
        $("#persons-table").append(tableitem);
    }
}

