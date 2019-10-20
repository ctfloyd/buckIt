
if (window.File && window.FileReader && window.FormData) {
	var $inputField = $('#file');

	$inputField.on('change', function (e) {
		var file = e.target.files[0];

		if (file) {
			if (/^image\//i.test(file.type)) {
				readFile(file);
			} else {
				alert('Not a valid image!');
			}
		}
	});
} else {
	alert("File upload is not supported!");
}

function readFile(file) {
	var reader = new FileReader();

	reader.onloadend = function () {
        document.getElementById("choose").innerText = file.name;  
        console.log(file);
        processFile(reader.result, file.type);     
	}

	reader.onerror = function () {
		alert('There was an error reading the file!');
	}

    reader.readAsDataURL(file);
}

function processFile(dataURL, fileType) {
	var maxWidth = 230;
	var maxHeight = 350;

	var image = new Image();
	image.src = dataURL;

	image.onload = function () {
		var width = image.width;
		var height = image.height;
		var shouldResize = (width > maxWidth) || (height > maxHeight);

		if (!shouldResize) {
			sendFile(dataURL);
			return;
		}

		var newWidth;
		var newHeight;

		if (width > height) {
			newHeight = height * (maxWidth / width);
			newWidth = maxWidth;
		} else {
			newWidth = width * (maxHeight / height);
			newHeight = maxHeight;
		}

		var canvas = document.createElement('canvas');

		canvas.width = newWidth;
		canvas.height = newHeight;

		var context = canvas.getContext('2d');

		context.drawImage(this, 0, 0, newWidth, newHeight);

        dataURL = canvas.toDataURL(fileType);
        
        storePicture(dataURL);
	};

	image.onerror = function () {
		alert('There was an error processing your file!');
	};
}

function storePicture(image) {
        let date = new Date().toMysqlFormat();
        console.log(date);
        let data = `op=publishEvent&location=Madison,WI&username=${sessionStorage.getItem("username")}&image=${image}&type=recycle&crateTime=${date}`;
        jQuery.ajax({
            type: "POST",
            url: '../calebOps.php',
            data: data,
            success: function(response)
            {
                var jsonData = JSON.parse(response);                
                // user is logged in successfully in the back-end
                // let's redirect
                if (jsonData.success == "1")
                {
                    sessionStorage.setItem("username", $("#username").val());
                    location.href = 'verify.html';
                }
                else
                {
                    alert('Invalid Credentials!');
                }
           }
       });
}

function twoDigits(d) {
    if(0 <= d && d < 10) return "0" + d.toString();
    if(-10 < d && d < 0) return "-0" + (-1*d).toString();
    return d.toString();
}

Date.prototype.toMysqlFormat = function() {
    return this.getUTCFullYear() + "-" + twoDigits(1 + this.getUTCMonth()) + "-" + twoDigits(this.getUTCDate()) + " " + twoDigits(this.getUTCHours()) + ":" + twoDigits(this.getUTCMinutes()) + ":" + twoDigits(this.getUTCSeconds());
};