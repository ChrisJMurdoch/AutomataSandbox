<!DOCTYPE html>

<html>
    <form action="php/actions/log_in.php" method="post">
        <input type="text" name="username" placeholder="USERNAME">
        <input type="password" name="password" placeholder="WRONG PASSWORD" style="border-color: red;">
        <input type="submit" value="LOGIN">
    </form>
<html>

<?php $_SESSION["state"] = "logged_out/ok"; ?>
