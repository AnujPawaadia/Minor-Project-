$(document).ready(function () {

    $('#showRegister').on('click', function (e) {
        e.preventDefault();
        $('#register-section').show();
        $('#login-section').hide();
    });

    $('#showLogin').on('click', function (e) {
        e.preventDefault();
        $('#login-section').show();
        $('#register-section').hide();
    });

    $('#user-tab').on('click', function () {
        $('#endUserRegistration').show();
        $('#clubAdminRegistration').hide();
    });

    $('#club-tab').on('click', function () {
        $('#clubAdminRegistration').show();
        $('#endUserRegistration').hide();
    });

   
    $("#loginForm").submit(function (e) {
        e.preventDefault(); 

        console.log("Form submission prevented");

        var loginData = {
            email: $("#loginEmail").val(),
            password: $("#loginPassword").val(),
            role: $("#loginRole").val()
        };
        console.log(loginData);

        $.ajax({
            url: "/api/auth/login", 
            type: "POST",
            contentType: "application/json", 
            data: JSON.stringify(loginData),
            success: function (response) {

                console.log(response);
                localStorage.setItem("token", response.token);
                localStorage.setItem("user", JSON.stringify(response.user));
                switch (response.role) {
                    case 'WEB_ADMIN':
                        fetchDashboard("/webAdmin/dashboard");
                        break;
                    case 'CLUB_ADMIN':
                        fetchDashboard("/clubAdmin/dashboard");
                        break;
                    default:
                        fetchDashboard("/home");
                        break;
                }
            },
            error: function (xhr, status, error) {
                console.error("Login failed:", error);
                const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : "Bad credentials";
                toastr.error(errorMessage || "Login failed"); 
            }
        });
    });

    function fetchDashboard(url) {
        const token = localStorage.getItem("token");
        console.log(token);
        $.ajax({
            url: url,
            type: "GET",
            headers: {
                "Authorization": "Bearer " + token
            },
            success: function (response) {
                console.log("Dashboard data:", response);
                window.location.replace(url);
            },
            error: function (xhr, status, error) {
                console.error("Access denied:", error);

                window.location.replace("/login");
            }
        });
    }


    $(document).ready(function () {

        if (localStorage.getItem('registrationSuccess') === 'true') {
            toastr.success('Registration successful! Please log in.');
    
            localStorage.removeItem('registrationSuccess');
        }
      
        $("#endUserForm").submit(function (e) {
            e.preventDefault(); 
        
            var registrationData = {
                user: {
                    username: $("#endUserUsername").val(),
                    email: $("#endUserEmail").val(),
                    password: $("#endUserPassword").val(),
                    role: "END_USER" 
                },
                club: null 
            };
        
        
            $.ajax({
                url: "http://localhost:8080/api/auth/register",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify(registrationData), 
                success: function (response) {
                    // toastr.success("Registration successful! Please log in.");
                    localStorage.setItem('registrationSuccess', 'true');
                    // localStorage.setItem('registrationSuccessMsg', 'Registration successful! Please log in.');

                    window.location.replace("http://localhost:8080/login");
                },
                error: function (xhr, status, error) {
                    console.error("End User registration failed:", error.message);
                    // console.log("XHR object:", xhr);
                    // console.log("Error object:", error);
                    const errorMessage = xhr.responseText ? xhr.responseText : "Registration failed";
                    toastr.error(errorMessage);
                }
            });
        });
        
    
$("#clubAdminForm").submit(function (e) {
    e.preventDefault();

    var user = {
        username: $("#clubAdminUsername").val(),
        email: $("#clubAdminEmail").val(),
        password: $("#clubAdminPassword").val(),
        role: "CLUB_ADMIN" 
    };

    var club = {
        clubName: $("#clubName").val(),
        slogan: $("#slogan").val(),
        description: $("#description").val()
    };

   
    var data = {
        user: user,
        club: club
    };

    $.ajax({
        url: "http://localhost:8080/api/auth/register", 
        type: "POST",
        contentType: 'application/json', 
        data: JSON.stringify(data), 
        success: function (response) {
          
            localStorage.setItem('registrationSuccess', 'true');
            localStorage.setItem('registrationSuccessMsg', 'Club registered successfully!! Login to access dashboard');
            window.location.replace("http://localhost:8080/login");
        },
        error: function (xhr, status, error) {
            console.error("Club Admin registration failed:", error);
            const errorMessage = xhr.responseJSON ? xhr.responseJSON.message : "Registration failed";
            toastr.error(errorMessage);
        }
    });
});


    });
    
});
