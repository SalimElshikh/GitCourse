(function () {
    var EmailModule = angular.module("EmailModule", []);

    EmailModule.controller("EmailController", function ($scope) {
        $scope.export = false;
        $scope.exportClasses = "btn btn-block btn-default";
        $scope.importClasses = "btn btn-block btn-primary";
        $scope.Recieved = getEmails();
        $scope.Sended = getEmails(true);
        $scope.loadExportedEmails = function (exported = false) {
            $scope.export = exported;
            [$scope.exportClasses, $scope.importClasses] = [$scope.importClasses, $scope.exportClasses]
        }

        $scope.unreadCount = getUnreadCount();
        $scope.openDetailsEmail = function (id) {
            window.location.href = "Details/" + id;
        }

        $scope.StarEmail = function (id) {
            $.ajax({
                url: "StarEmail",
                type: "POST",
                async: true,
                data: {
                    "id": id,
                }
            })
        }

        $scope.delete = function (id) {
            var confirmed = confirm("هل أنت متأكد من الحذف ؟");
            if (confirmed) {
                var status = deleteEmail(id);
                if (status == 200) {
                    $scope.Recieved = getEmails();
                    $scope.Sended = getEmails(true);
                }
            }
        }
    })
})()
setTimeout("preventBack()", 0);
window.onunload = function () { null }
function getEmails(exported = false) {
    var emails;
    $.ajax({
        url: "GetEmails",
        type: "GET",
        async: false,
        data: {
            "export": exported,
        },
        success: function (result) {
            emails = result;
        }
    })
    return emails;
}
function getUnreadCount() {
    var unreadCount = 0;
    $.ajax({
        url: "CountOfUnReadEmails",
        type: "GET",
        async: false,

        success: function (result) {
            unreadCount = result;
        }
    })
    return unreadCount;
}

function deleteEmail(id) {
    var status = 0;
    $.ajax({
        url: "Delete",
        type: "POST",
        async: false,
        data: {
            "id": id,
        }, success: function (result) {
            status = result;
        }
    })
    return status;
}

function DownloadFile(id) {
    window.location.href = window.location.origin + "/Document/Download/" + id;
}
function disableBtn() {
    $("#btn-add").attr('disabled', 'disabled');    
}

//function preventBack() {
//    window.history.forward();
//}

//setTimeout(preventBack, 0);
//window.onunload = function () { null };  // Prevent back navigation on unload
