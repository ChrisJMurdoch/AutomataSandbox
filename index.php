
<?php $db_connection = pg_connect("host=" . $_SERVER["DB_HOST"] . " dbname=" . $_SERVER["DB_NAME"] . " user=" . $_SERVER["DB_USER"] . " password=" . $_SERVER["DB_PASSWORD"] . ""); ?>
<?php $users = pg_query($db_connection, "SELECT username FROM users"); ?>
<?php include_once("home.html"); ?>
