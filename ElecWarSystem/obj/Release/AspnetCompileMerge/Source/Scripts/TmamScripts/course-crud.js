(function () {
    var mod = angular.module("CourseMod", []);
    mod.controller("CourseCrud", function ($scope) {
        $scope.Name = "تمام الفرق و الدورات التعليمية"
        $scope.Courses = GetCourses();
        var numbers = GetNumbers();
        $scope.CoursesTotal = numbers["total"];
        $scope.CoursesEntered = numbers["entered"];
        setCourseAddStatus($scope.CoursesTotal, $scope.CoursesEntered)

        $scope.Add = function () {
            $.ajax({
                url: window.location.origin + "/Course/Create",
                type: "POST",
                async: false,
                data: {
                    "CourseDetails.PersonID": $("#person-name").val(),
                    "CourseDetails.CourseName": $("#course-name").val(),
                    "CourseDetails.CoursePlace": $("#course-place").val(),
                    "CourseDetails.DateFrom": $("#date-from").val(),
                    "CourseDetails.DateTo": $("#date-to").val(),
                    "CourseDetails.CommandItem.Number": $("#command-number").val(),
                    "CourseDetails.CommandItem.Date": $("#command-date").val() 
                },
                success: function (result) {
                    if (result == -1) {
                        alert("يوجد خطأ فى تاريخ الفرقة");
                    }
                    else {
                        $scope.closePop();
                        $scope.Courses = GetCourses();
                        emptyFormField();
                        $scope.CoursesEntered = $scope.CoursesEntered + 1;
                        setCourseAddStatus($scope.CoursesTotal, $scope.CoursesEntered);
                    }
                }
            })
        }

        $scope.delete = function (id) {
            $.ajax({
                url: window.location.origin + "/Course/Delete",
                type: "POST",
                async: false,
                data: {
                    "id": id,
                },
                success: function () {
                    $scope.Courses = GetCourses();
                    $scope.CoursesEntered = $scope.CoursesEntered - 1;
                    setCourseAddStatus($scope.CoursesTotal, $scope.CoursesEntered);
                }
            })
        }

        $scope.openCoursePopup = function () {
            document.querySelector(".course-popup").classList.add("act");
        }

        $scope.closePop = function() {
            document.querySelector(".course-popup").classList.remove("act");
        }
    });
})()
function validateCourseName() {
    disableBtn();
    if ($("#course-name").val().length >= 25) {
        $("#course-name-warn").removeAttr('hidden');
    } else {
        $("#course-name-warn").attr('hidden', 'hidden');
    }

}
function setCourseAddStatus(total, entered)
{
    if (total == entered) {
        console.log(total);
        console.log(entered);

        $("#add-course-btn").attr('disabled', 'disabled');
    } else {
        $("#add-course-btn").removeAttr('disabled');
    }
}

function GetCourses() {
    var courses = [];
    $.ajax({
        url: window.location.origin + "/Course/GetCourses",
        type: "GET",
        async: false,
        success: function (result) {
            courses = result;
            
            for (var i in courses)
            {
                courses[i]["CourseDetails"]["DateFrom"] = getDateFormated(courses[i]["CourseDetails"]["DateFrom"]);
                courses[i]["CourseDetails"]["DateTo"] = getDateFormated(courses[i]["CourseDetails"]["DateTo"]);
                courses[i]["CourseDetails"]["CommandItem"]["Date"] = getDateFormated(courses[i]["CourseDetails"]["CommandItem"]["Date"]);
            }
        }
    })
    return courses;
}
function emptyFormField()
{
    $("#person-rank").val(null)
    $("#person-name").val(null)
    $("#course-name").val(null)
    $("#course-place").val(null)
    $("#date-from").val(null)
    $("#date-to").val(null)
    $("#command-number").val(null)
    $("#command-date").val(null)
}
function openCoursePopup() {
    document.querySelector(".course-popup").classList.add("act");
}
function disableBtn() {
    if (IsAllFieldsFilled()) {
        $(".popup-submit-btn").removeAttr('disabled');
    }
    else {
        $(".popup-submit-btn").attr('disabled', 'disabled');
    }
}

function IsAllFieldsFilled() {
    var result =
        $("#person-name").val() !== "" &&
        $("#person-rank").val() !== "" &&
        $("#course-place").val() !== "" &&
        $("#course-place").val() !== "" &&
        $("#date-from").val() !== "" &&
        $("#date-to").val() !== "" &&
        $("#command-number").val() !== "" &&
        $("#command-date").val() !== ""
    return result;
}

function GetNumbers() {
    var numbers = [];
    $.ajax({
        url: window.location.origin + "/Course/GetNumbers",
        type: "GET",
        async: false,
        success: function (result) {
            numbers = result;
        }
    })
    return numbers;
}