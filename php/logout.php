<!DOCTYPE html>

<html>
    Logged in as <?php echo $_SESSION["username"]; ?>
    <form action="index.php" method="post">
        <button type="submit" formmethod="post" name="action" value="log_out">Log Out</button>
    </form>
<html>
