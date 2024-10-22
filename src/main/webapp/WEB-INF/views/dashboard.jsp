<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<%@ taglib prefix="form" uri="http://www.springframework.org/tags/form" %>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Dashboard</title>
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="${pageContext.request.contextPath}/js/common.js"></script>
</head>
<body>
    <h1>Web Admin Dashboard</h1>

    <div id="userDetails">
        <p>Welcome, <span id="userEmail"></span>!</p>
        <p>Your role is: <span id="userRole"></span></p>
        <h2>User details:</h2>
        <p>Username: <span id="userUsername"></span></p>
    </div>

    <c:if test="${not empty error}">
        <p style="color: red;">${error}</p>
    </c:if>
    
    <a href="#" id="viewUserList">View User List</a>
    <br>
    <a href="#" id="viewClubsList">View Clubs List</a>
    <br>
    <br>
    <a href="#" id="logoutLink">Logout</a>

    <!-- Section to display JSON response -->
    <div id="jsonDisplay" style="margin-top: 20px;">
        <h2>Data Response:</h2>
        <pre id="jsonOutput"></pre> <!-- Using <pre> tag to format JSON -->
    </div>

    <script>
        $(document).ready(function() {
            // Get the token and user details from localStorage
            const token = localStorage.getItem("token");
            const user = JSON.parse(localStorage.getItem("user")); // Parse user details from localStorage

            // Display user details if available
            if (user) {
                $("#userEmail").text(user.email);
                $("#userRole").text(user.role);
                $("#userUsername").text(user.username);
            } else {
                alert("User details not found. Please log in again.");
                window.location.href = "${pageContext.request.contextPath}/login"; // Redirect to login page
            }

            // Function to make API call with token
            function fetchWithToken(url) {
                if (token) {
                    $.ajax({
                        url: url,
                        type: "GET",
                        headers: {
                            "Authorization": "Bearer " + token // Include token in headers
                        },
                        success: function(response) {
                            // Handle successful response by displaying JSON
                            console.log(response); // For debugging
                            $("#jsonOutput").text(JSON.stringify(response, null, 2)); // Pretty print JSON
                        },
                        error: function(xhr, status, error) {
                            console.error("Request failed:", error);
                            alert("Failed to fetch data. Please check your authentication.");
                            // Optionally, redirect to login if authentication fails
                            window.location.href = "${pageContext.request.contextPath}/login"; // Redirect to login page
                        }
                    });
                } else {
                    alert("You need to log in to access this page.");
                    window.location.href = "${pageContext.request.contextPath}/login"; // Redirect to login page if no token
                }
            }

            // Event handler for viewing user list
            $("#viewUserList").on("click", function(e) {
                e.preventDefault(); // Prevent the default link behavior
                fetchWithToken("${pageContext.request.contextPath}/api/user/list");
            });

            // Event handler for viewing clubs list
            $("#viewClubsList").on("click", function(e) {
                e.preventDefault(); // Prevent the default link behavior
                fetchWithToken("${pageContext.request.contextPath}/api/clubs/list");
            });

            $("#logoutLink").on("click", function(e) {
            e.preventDefault(); // Prevent the default link behavior
            logout(); // Call the logout function
    });
        });
    </script>
</body>
</html>