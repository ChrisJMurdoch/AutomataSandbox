
<?php

    session_start();

    // Log out
    $_SESSION["state"] = "logged_out/ok";
    unset( $_SESSION["username"] );

    // Return to root
    header("Location: ../../");

?>
