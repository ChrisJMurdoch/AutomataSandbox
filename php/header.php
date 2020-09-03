
<?php

    // INITIALISE

    // Start session
    session_start();

    // Connect to database
    $db_connection = pg_connect(
        "host=" . $_SERVER["DB_HOST"] . 
        " dbname=" . $_SERVER["DB_NAME"] . 
        " user=" . $_SERVER["DB_USER"] . 
        " password=" . $_SERVER["DB_PASSWORD"]
    );

    // VERIFY

    // Default state to logged_out
    if( !isset($_SESSION["state"]) || $_SESSION["state"] != "logged_in" || ( isset($_POST["action"]) && $_POST["action"] == "log_out" ) ) {
        $_SESSION["state"] = "logged_out";
        $_SESSION["username"] = "default";
    }
    
    // Logging in
    if ( isset($_POST["username"]) && isset($_POST["password"]) ) {

        // Validate password
        if ( $_POST["password"] == "admin" ) {
            $_SESSION["state"] = "logged_in";
            $_SESSION["username"] = $_POST["username"];
        } else {
            $_SESSION["state"] = "wrong_password";
        }
    }
?>
