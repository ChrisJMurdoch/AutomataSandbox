
<?php

    session_start();

    // Connect to database
    $db_connection = pg_connect(
        "host=" . $_SERVER["DB_HOST"] . 
        " dbname=" . $_SERVER["DB_NAME"] . 
        " user=" . $_SERVER["DB_USER"] . 
        " password=" . $_SERVER["DB_PASSWORD"]
    );

    // Validate username
    if ( isset($_POST["username"]) &&  $_POST["username"] == "Chris" ) {

        // Validate password
        if ( isset($_POST["password"]) &&  $_POST["password"] == "admin" ) {
            $_SESSION["state"] = "logged_in";
            $_SESSION["username"] = $_POST["username"];
        } else {
            $_SESSION["state"] = "logged_out_wp"; // Wrong password
        }

    } else {
        $_SESSION["state"] = "logged_out_wu"; // Wrong username
    }

    // Return to root
    header("Location: ../../");

?>
