
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
    if ( pg_num_rows( pg_query( "SELECT username FROM users WHERE username = '" . pg_escape_string($_POST["username"]) . "'" ) ) >= 1 ) {

        // Validate password
        if ( $_POST["password"] == pg_fetch_result( pg_query( "SELECT hash FROM users WHERE username = '" . pg_escape_string($_POST["username"]) . "'" ), 0, "hash" ) ) {
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
