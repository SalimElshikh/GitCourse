function GetTmamDetail(tmamID) {
    window.location.href = `${window.location.origin}/TmamGathering/TmamDetails?id=${tmamID}`
}

function RecieveTmam(id) {
    console.log(id);
    $.ajax({
        url: window.location.origin + "/TmamGathering/MakeTmamRecive",
        type: "POST",
        async: false,
        data: {
            "unitID": id
        }, success: function () {
            window.location.href = `${window.location.origin}/TmamGathering/RecievedTmam`
        }
    })
}