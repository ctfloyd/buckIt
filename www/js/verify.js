$(document).ready(function () {
    if(!sessionStoragee.getItem("username")) location.href = "login.html";
    
    document.addEventListener('touchstart', handleTouchStart, false);        
    document.addEventListener('touchmove', handleTouchMove, false);

    var xDown = null;                                                        
    var yDown = null;

    function getTouches(evt) {
    return evt.touches ||             // browser API
            evt.originalEvent.touches; // jQuery
    }                                                     

    function handleTouchStart(evt) {
        const firstTouch = getTouches(evt)[0];                                      
        xDown = firstTouch.clientX;                                      
        yDown = firstTouch.clientY;                                      
    };                                                

    function handleTouchMove(evt) {
        if ( ! xDown || ! yDown ) {
            return;
        }

        var xUp = evt.touches[0].clientX;                                    
        var yUp = evt.touches[0].clientY;

        var xDiff = xDown - xUp;
        var yDiff = yDown - yUp;

        if ( Math.abs( xDiff ) > Math.abs( yDiff ) ) {/*most significant*/
            if ( xDiff > 0 ) {
                setVerification(false); 
            } else {
                setVerification(true);
            }                       
        }
        /* reset values */
        xDown = null;
        yDown = null;  
    }

    let currentEventID = null;
    let eventUser = null;
    function getNextImage() {
        let data = `op=getEvent&username=${sessionStorage.getItem("username")}`;
        jQuery.ajax({
            type: "POST",
            url: '../calebOps.php',
            data: data,
            success: function(response)
            {
                var jsonData = JSON.parse(response);             
                // user is logged in successfully in the back-end
                // let's redirect
                if (jsonData.success.image)
                {
                    let image = jsonData.success.image;
                    image = image.replace(/\s/g, "+");
                    $("#rateMe").attr("src", image);
                    $("#nameField").html(jsonData.success.username);
                    $("#dateField").html(jsonData.success.createtime);
                    currentEventID = jsonData.success.eventid;
                    eventUser = jsonData.success.username;
                }
                else
                {
                    alert('No photos available, get dripping!');
                }
        }
        });
    }

    function setVerification(ver){
        let val = ver == false ? 0 : 1;
        let data = `op=verifyEvent&eventID=${currentEventID}&verified=${val}`;
        jQuery.ajax({
            type: "POST",
            url: '../calebOps.php',
            data: data,
            success: function(response)
            {
                var jsonData = JSON.parse(response);   
                console.log(jsonData);        
                // user is logged in successfully in the back-end
                // let's redirect
                if (jsonData.success == 1)
                {
                    let username = sessionStorage.getItem("username");
                    getNextImage();
                    updatePoints(username, 1);
                    updatePoints(eventUser, 10);
                }
                else
                {
                    alert('Error communicating with server.');
                }
        }
        });
    }

    function updatePoints(user, amount){
        let data = `op=addPoints&username=${user}&points=${amount}`;
        jQuery.ajax({
            type: "POST",
            url: '../calebOps.php',
            data: data,
            success: function(response)
            {
                var jsonData = JSON.parse(response);          
                // user is logged in successfully in the back-end
                // let's redirect
                if (jsonData.success == 1)
                {
                    console.log("added points");
                }
                else
                {
                    alert('Error communicating with server.');
                }
        }
        });
    }

    document.getElementById("tdButton").onclick = () => setVerification(false);
    document.getElementById("tuButton").onclick = () => setVerification(true);


    getNextImage();
});