window.onload = function () {
    seterrandCounter();
    RequestTmamStatus();
    numbersE2A();
};

function IsAllFieldsFilled() {
    // Check if all fields in the modal are filled
    var result =
        $("#person-name").val() !== "" &&
        $("#person-rank").val() !== "" &&
        $("#hospital-name").val() !== "" &&
        $("#diagnosis").val() !== "" &&
        $("#date-from").val() !== "" &&
        $("#date-to").val() !== "";
    return result;
}

function disableBtn() {
    // Enable the button if all fields are filled
    if (IsAllFieldsFilled()) {
        $(".popup-submit-btn").removeAttr('disabled');
    } else {
        $(".popup-submit-btn").attr('disabled', 'disabled');
    }
}

function Add() {
    // Make an AJAX request to add a new errand entry
    $.ajax({
        url: window.location.origin + "/errand/Create",  // Assuming the correct endpoint for errand creation
        type: "POST",
        async: false,
        data: {
            "errand.PersonID": $("#person-name").val(),
            "errand.HospitalName": $("#hospital-name").val(),
            "errand.Diagnosis": $("#diagnosis").val(),
            "errand.DateFrom": $("#date-from").val(),
            "errand.DateTo": $("#date-to").val()
        },
        success: function (result) {
            if (result == -1) {
                Swal.fire("خطأ", "يوجد خطأ في تاريخ الإجازة المرضية", "error");
            } else {
                Swal.fire("تم بنجاح!", "تم إضافة المأمورية بنجاح", "success");
                closePop();
                UpdateerrandTable();
                IncreaseerrandCounter();
                emptyFormField();
            }
        }
    });
}

function emptyFormField() {
    // Clear form fields after submission
    $("#person-name").val(null);
    $("#person-rank").val(null);
    $("#hospital-name").val(null);
    $("#diagnosis").val(null);
    $("#date-from").val(null);
    $("#date-to").val(null);
}

function UpdateerrandTable() {
    // Update the errand table with fresh data
    $.ajax({
        url: window.location.origin + "/errand/Geterrands", // Assuming this is the endpoint for fetching errands
        type: "GET",
        async: false,
        success: function (result) {
            fillerrandTable(result);
        }
    });
}

function fillerrandTable(result) {
    // Fill the errand table with data
    $("#errand-table").empty();
    var tableHead = `
        <thead>
            <th>م</th>
            <th>الرتبة / الدرجة</th>
            <th>الإسم </th>
            <th>إسم المستشفى</th>
            <th>التشخيص</th>
            <th>التاريخ من</th>
            <th>التاريخ إلى</th>
            <th>الإجراءات</th>
        </thead>`;
    $("#errand-table").append(tableHead);

    for (var index in result) {
        var tableItem = `
            <tbody style="font-size:14px;">
                <td>${parseInt(index) + 1}</td>
                <td>${result[index]['errand']['Person']['Rank']['RankName']}</td>
                <td>${result[index]['errand']['Person']['FullName']}</td>
                <td>${result[index]['errand']['HospitalName']}</td>
                <td>${result[index]['errand']['Diagnosis']}</td>
                <td>${getDateFormatted(result[index]['errand']['DateFrom'])}</td>
                <td>${getDateFormatted(result[index]['errand']['DateTo'])}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteerrand(${result[index]['ID']})">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </td>
            </tbody>`;
        $("#errand-table").append(tableItem);
    }
}

function openErrandPopup() {
    // Open the errand modal
    $('#errandModal').modal('show');
}

function closePop() {
    // Close the errand modal
    $('#errandModal').modal('hide');
}

function seterrandCounter() {
    var listOfErrandNumbers = $("#errand-counter").text().split("/");
    var currentErrandCount = parseInt(listOfErrandNumbers[0]);
    var totalErrandCount = parseInt(listOfErrandNumbers[1]);
    if (totalErrandCount === currentErrandCount) {
        $("#add-errand-btn").attr('disabled', 'disabled');
    } else {
        $("#add-errand-btn").removeAttr('disabled');
    }
}

function IncreaseerrandCounter() {
    // Increase the errand counter
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

function DecreaseerrandCounter() {
    // Decrease the errand counter
    var listOfErrandNumbers = $("#errand-counter").text().split("/");
    var currentErrandCount = parseInt(listOfErrandNumbers[0]);
    var totalErrandCount = parseInt(listOfErrandNumbers[1]);
    currentErrandCount -= 1;
    $("#add-errand-btn").removeAttr('disabled');
    var newStr = `${currentErrandCount} / ${totalErrandCount}`;
    $("#errand-counter").text(newStr);
}

function deleteErrand(id) {
    // Confirmation before deleting errand entry
    Swal.fire({
        title: 'هل أنت متأكد؟',
        text: "لن يمكنك التراجع عن هذا!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'نعم، احذفه!',
        cancelButtonText: 'إلغاء'
    }).then((result) => {
        if (result.isConfirmed) {
            // Proceed to delete if confirmed
            $.ajax({
                url: window.location.origin + "/errand/Delete",
                type: "POST",
                async: false,
                data: {
                    "errandID": id
                },
                success: function (result) {
                    UpdateerrandTable();
                    DecreaseerrandCounter();
                    Swal.fire("تم الحذف!", "تم حذف المأمورية بنجاح", "success");
                }
            });
        }
    });
}

function getDateFormatted(date) {
    // Helper function to format date (customize as needed)
    var d = new Date(date);
    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}
