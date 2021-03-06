var numberOfReservation = 0;
function buildHTML(tag, html, attrs) {
    if (typeof (html) != 'string') {
        attrs = html;
        html = null;
    }
    var h = '<' + tag;
    for (attr in attrs) {
        if (attrs[attr] === false)
            continue;
        h += ' ' + attr + '="' + attrs[attr] + '"';
    }
    return h += html ? ">" + html + "</" + tag + ">" : "/>";
}

function printTodayDate(){
    var today = new Date();
    var options = {
    weekday: "long", year: "numeric", month: "short",
    day: "numeric", hour: "2-digit", minute: "2-digit"
    };
    $("#todayDate").html(today.toLocaleTimeString("en-us", options));
}

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function getNumberOfResevations() {
    return numberOfReservation;
}
function incrementNumberOfReservations(){
    numberOfReservation++;
}

function renderUserReservationList(reservations) {
    numberOfReservation = 0;
    var reservationListHTML = $(".reservations-table");
    var reservationHeaderHTML = renderReservationHeader();
    reservationHeaderHTML.appendTo(reservationListHTML);
    if (reservations.length === 0) {
        var row = $("<div></div>", {
            class: "row",
            text: "No reservations available."
        })
        row.appendTo(reservationListHTML);
    } else {
        reservations.forEach(function (resv) {
            incrementNumberOfReservations();
            var row = renderReservationRow(resv);
            row.appendTo(reservationListHTML);
        });
    }

    function renderReservationRow(resv) {

        var start_time = resv.startTime;
        start_time = start_time.substr(0,10) + ' ' + start_time.substr(10 + 1);
        start_time = start_time.substr(0,19); 

        var end_time = resv.endTime;
        end_time = end_time.substr(0,10) + ' ' + end_time.substr(10 + 1);
        end_time = end_time.substr(0,19); 

        var rowHTML = $("<div></div>", {
            class: "row"
        });
        var roomNumberCell = $("<div></div>", {
            text: resv.roomNumber,
            class: "cell"
        });
        roomNumberCell.appendTo(rowHTML);
        var startTimeCell = $("<div></div>", {
            text: start_time,
            class: "cell"
        });
        startTimeCell.appendTo(rowHTML);
        var endTimeCell = $("<div></div>", {
            text: end_time,
            class: "cell"
        });
        endTimeCell.appendTo(rowHTML);
        var actionsCell = $("<div></div>", {
            class: "cell btnFlex"
        });

        var modifyBtn = $("<a></a>", {
            class: "Waves-effect waves-light btn modifyBtn",
            text: "Modify",
            "data-reservationid": resv.reservationID
        });

        modifyBtn.data("reservationID", resv.reservationID);
        modifyBtn.click(function () {
            $('#modifyModal').modal({
                dismissible: true,
                opacity: .8,
                in_duration: 300,
                out_duration: 200,
                starting_top: '4%',
                ending_top: '10%',
                ready: function (modal, trigger) {
                    clearModal();
                    initializeModifyModal(resv);
                    // Callback for Modal open. Modal and trigger parameters available.
                },
                complete: function () { }
            });
            $('#modifyModal').modal('open');
        });
        modifyBtn.appendTo(actionsCell)

        var deleteBtn = $("<a></a>", {
            class: "Waves-effect waves-light btn deleteBtn",
            text: "Delete",
            "data-reservationid": resv.reservationID,
            "data-roomNumber": resv.roomNumber
        });

        deleteBtn.data("reservationID", resv.reservationID);
        deleteBtn.click(function () {
            deleteReservation($(this).attr("data-reservationid"), $(this).attr("data-roomNumber"));
        });
        deleteBtn.appendTo(actionsCell)
        actionsCell.appendTo(rowHTML);
        return rowHTML;
    }
}

function renderReservationHeader() {
    var header = $("<div></div>", {
        class: "row"
    });
    header.addClass("row table-header");
    var roomNumberCell = $("<div></div>", {
        class: "cell",
        text: "Room Number"
    });
    var startTimeCell = $("<div></div>", {
        class: "cell",
        text: "Start Time"
    });
    var endTimeCell = $("<div></div>", {
        class: "cell",
        text: "End Time"
    });
    var actionsCell = $("<div></div>", {
        class: "cell",
        text: "Actions"
    });
    roomNumberCell.appendTo(header);
    startTimeCell.appendTo(header);
    endTimeCell.appendTo(header);
    actionsCell.appendTo(header);
    return header;
}

function renderWaitlist(waitlist) {
    numberOfReservation = 0;
    var waitListHTML = $(".waitlist-table");
    var waitlistHeaderHTML = renderWaitlistHeader();
    waitlistHeaderHTML.appendTo(waitListHTML);
    if (waitlist.length === 0) {
        var row = $("<div></div>", {
            class: "row",
            text: "No reservations on the waitlist."
        })
        row.appendTo(waitListHTML);
    } else {
        waitlist.forEach(function (waitlistItem) {
            //incrementNumberOfReservations();
            var row = renderWaitlistRow(waitlistItem);
            row.appendTo(waitListHTML);
        });
    }

    function renderWaitlistRow(waitlistItem) {

        var start_time = waitlistItem.startTime;
        start_time = start_time.substr(0,10) + ' ' + start_time.substr(10 + 1);
        start_time = start_time.substr(0,19); 

        var end_time = waitlistItem.endTime;
        end_time = end_time.substr(0,10) + ' ' + end_time.substr(10 + 1);
        end_time = end_time.substr(0,19); 

        var rowHTML = $("<div></div>", {
            class: "row"
        });
        var roomNumberCell = $("<div></div>", {
            text: waitlistItem.roomNumber,
            class: "cell"
        });
        roomNumberCell.appendTo(rowHTML);
        var startTimeCell = $("<div></div>", {
            text: start_time,
            class: "cell"
        });
        startTimeCell.appendTo(rowHTML);
        var endTimeCell = $("<div></div>", {
            text: end_time,
            class: "cell"
        });
        endTimeCell.appendTo(rowHTML);
        return rowHTML;
    }
}

function renderWaitlistHeader() {
    var header = $("<div></div>", {
        class: "row"
    });
    header.addClass("row table-header");
    var roomNumberCell = $("<div></div>", {
        class: "cell",
        text: "Room Number"
    });
    var startTimeCell = $("<div></div>", {
        class: "cell",
        text: "Start Time"
    });
    var endTimeCell = $("<div></div>", {
        class: "cell",
        text: "End Time"
    });
    roomNumberCell.appendTo(header);
    startTimeCell.appendTo(header);
    endTimeCell.appendTo(header);

    return header;
}