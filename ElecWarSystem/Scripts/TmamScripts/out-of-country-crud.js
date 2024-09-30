window.onload = function () {
    setOutOfCountryCounter();
    RequestTmamStatus();
    numbersE2A();
};

function openOutOfCountryPopup() {
    $('#outOfCountryModal').modal('show'); // Open the modal
}

function closeOutOfCountryPopup() {
    $('#outOfCountryModal').modal('hide'); // Close the modal
}
function IsAllFieldsFilled() {
    // Check if all required fields are filled
    var result =
        $("#person-name").val() !== "" &&
        $("#person-rank").val() !== "" &&
        $("#country").val() !== "" &&
        $("#purpose").val() !== "" &&
        $("#date-from").val() !== "" &&
        $("#date-to").val() !== "";
    return result;
}

function disableBtn() {
    // Enable the submit button if all fields are filled
    if (IsAllFieldsFilled()) {
        $(".popup-submit-btn").removeAttr('disabled');
    } else {
        $(".popup-submit-btn").attr('disabled', 'disabled');
    }
}
function Add() {
    // التحقق من أن القيم صالحة قبل الإرسال
    if (!isDateValid($("#date-from").val()) || !isDateValid($("#date-to").val())) {
        Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'يرجى إدخال تواريخ صالحة',
        });
        return;
    }

    // استدعاء Ajax لإضافة البيانات
    $.ajax({
        url: window.location.origin + "/OutOfCountry/Create",
        type: "POST",
        async: false,
        data: {
            "outOfCountryDetail.PersonID": $("#person-name").val(),
            "outOfCountryDetail.Country": $("#country").val(),
            "outOfCountryDetail.Puspose": $("#purpose").val(),
            "outOfCountryDetail.DateFrom": $("#date-from").val(),
            "outOfCountryDetail.DateTo": $("#date-to").val()
        },
        success: function (result) {
            if (result == -1) {
                Swal.fire({
                    icon: 'error',
                    title: 'خطأ',
                    text: 'يوجد خطأ فى التواريخ',
                });
            } else {
                $('#outOfCountryModal').modal('hide');  // إغلاق النافذة بعد الإضافة الناجحة
                UpdateOutOfCountriesTable();
                IncreaseOutOfCountryCounter();
                emptyFormField();
                Swal.fire({
                    icon: 'success',
                    title: 'تم الحفظ',
                    text: 'تم إضافة المأمورية بنجاح',
                });
            }
        }
    });
}
function getDateFormatted(date) {
    // التحقق من أن القيمة ليست فارغة وصحيحة
    if (!isDateValid(date)) {
        return 'N/A';
    }

    var d = new Date(date);
    return d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear();
}

function emptyFormField() {
    // Clear all form fields after submission
    $("#person-name").val(null);
    $("#person-rank").val(null);
    $("#country").val(null);
    $("#purpose").val(null);
    $("#date-from").val(null);
    $("#date-to").val(null);
}

function UpdateOutOfCountriesTable() {
    // Fetch and update the "Out of Country" table
    $.ajax({
        url: window.location.origin + "/outOfCountry/GetOutOfCountries",
        type: "GET",
        async: false,
        success: function (result) {
            fillOutOfCountriesTable(result);
        }
    });
}

function fillOutOfCountriesTable(result) {
    // Clear the table before populating it with new data
    $("#out-of-country-table").empty();

    var tableHead = `
        <thead>
            <th>م</th>
            <th>الرتبة / الدرجة</th>
            <th>الإسم </th>
            <th>جهة السفر</th>
            <th>الغرض من السفر</th>
            <th>المدة من</th>
            <th>المدة إلى</th>
            <th>الإجراءات</th>
        </thead>`;
    $("#out-of-country-table").append(tableHead);

    for (var index in result) {
        // استخدم فحصًا للتأكد من أن التواريخ صحيحة قبل تنسيقها
        var dateFrom = result[index]['OutOfCountryDetail']['DateFrom'];
        var dateTo = result[index]['OutOfCountryDetail']['DateTo'];

        // التحقق من أن القيم ليست null أو undefined
        var formattedDateFrom = dateFrom ? getDateFormatted(dateFrom) : 'N/A';
        var formattedDateTo = dateTo ? getDateFormatted(dateTo) : 'N/A';

        var tableItem = `
            <tbody style="font-size:14px;">
                <td>${parseInt(index) + 1}</td>
                <td>${result[index]['OutOfCountryDetail']['Person']['Rank']['RankName']}</td>
                <td>${result[index]['OutOfCountryDetail']['Person']['FullName']}</td>
                <td>${result[index]['OutOfCountryDetail']['Country']}</td>
                <td>${result[index]['OutOfCountryDetail']['Puspose']}</td>
                <td>${formattedDateFrom}</td>
                <td>${formattedDateTo}</td>
                <td>
                    <button class="btn btn-outline-danger btn-sm rounded-circle" onclick="deleteOutOfCountry(${result[index]["ID"]})">
                        <i class="fas fa-trash-alt"></i> 
                    </button>
                </td>
            </tbody>`;
        $("#out-of-country-table").append(tableItem);
    }
}

function setOutOfCountryCounter() {
    // Update the counter and handle adding button status
    var listOfOutOfCountryNumbers = $("#out-of-country-counter").text().split("/");
    var currentOutOfCountryCount = parseInt(listOfOutOfCountryNumbers[0]);
    var totalOutOfCountryCount = parseInt(listOfOutOfCountryNumbers[1]);
    if (totalOutOfCountryCount === currentOutOfCountryCount) {
        $("#add-out-of-country-btn").attr('disabled', 'disabled');
    } else {
        $("#add-out-of-country-btn").removeAttr('disabled');
    }
}

function IncreaseOutOfCountryCounter() {
    // Increase the "Out of Country" counter
    var listOfOutOfCountryNumbers = $("#out-of-country-counter").text().split("/");
    var currentOutOfCountryCount = parseInt(listOfOutOfCountryNumbers[0]);
    var totalOutOfCountryCount = parseInt(listOfOutOfCountryNumbers[1]);
    currentOutOfCountryCount += 1;
    if (totalOutOfCountryCount === currentOutOfCountryCount) {
        $("#add-out-of-country-btn").attr('disabled', 'disabled');
    }
    var newStr = `${currentOutOfCountryCount} / ${totalOutOfCountryCount}`;
    $("#out-of-country-counter").text(newStr);
}

function DecreaseOutOfCountryCounter() {
    // Decrease the "Out of Country" counter
    var listOfOutOfCountryNumbers = $("#out-of-country-counter").text().split("/");
    var currentOutOfCountryCount = parseInt(listOfOutOfCountryNumbers[0]);
    var totalOutOfCountryCount = parseInt(listOfOutOfCountryNumbers[1]);
    currentOutOfCountryCount -= 1;
    $("#add-out-of-country-btn").removeAttr('disabled');
    var newStr = `${currentOutOfCountryCount} / ${totalOutOfCountryCount}`;
    $("#out-of-country-counter").text(newStr);
}

function deleteOutOfCountry(id) {
    // Delete a specific "Out of Country" entry
    $.ajax({
        url: window.location.origin + "/OutOfCountry/Delete",
        type: "POST",
        async: false,
        data: { id: id },
        success: function (result) {
            UpdateOutOfCountriesTable();
            DecreaseOutOfCountryCounter();
            Swal.fire({
                icon: 'success',
                title: 'تم الحذف',
                text: 'تم حذف المأمورية بنجاح',
            });
        }
    });
}
function isDateValid(dateString) {
    var date = new Date(dateString);
    return !isNaN(date.getTime()); // تتحقق إذا كان التاريخ صالحًا
}

