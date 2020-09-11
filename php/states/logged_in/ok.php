<!DOCTYPE html>

<html>
    Logged in as <span style="color: orange"><?php echo $_SESSION["username"]; ?></span>
    <form action="php/actions/log_out.php" method="post">
        <button type="submit" formmethod="post" name="action" value="log_out">Log Out</button>
    </form>
<html>
