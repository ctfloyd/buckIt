$(document).ready(function () {
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
                /* left swipe */ 
                alert("left swipe");
            } else {
                /* right swipe */
                alert("right swipe");
            }                       
        }
        /* reset values */
        xDown = null;
        yDown = null;  
    }

    function getNextImage() {
        let data = `op=getEvent&username=${sessionStorage.getItem("username")}`;
        jQuery.ajax({
            type: "POST",
            url: '../calebOps.php',
            data: data,
            success: function(response)
            {
                var jsonData = JSON.parse(response);    
                console.log(jsonData.success);          
                // user is logged in successfully in the back-end
                // let's redirect
                if (jsonData.success.image)
                {
                    let image = jsonData.success.image;
                    image = image.replace(/\s/g, "+");
                    $("#rateMe").attr("src", image);
                    $("#nameField").html(jsonData.success.username);
                    $("#dateField").html(jsonData.success.createtime);
                }
                else
                {
                    console.log(jsonData);
                    alert('Error uploading photo!');
                }
        }
        });
    }

    function setVerification(ver){
        return;
    }


    getNextImage();
});