	<?php
		require("phpsqlajax_dbinfo.php");
		$conn = new mysqli($hostname, $username, $password, $database);
		//checking if there were any error during the last connection attempt
		if ($conn->connect_error) {
		  die("Connection failed: " . $conn->connect_error);
		}
		$query = "select username from users";
		$result = $conn->query($query);
		?>
		
		 <select id='username'>
		<?php
		while ($row = $result->fetch_assoc()) {
			echo "<option value='" . $row['username'] . "'>" . $row['username'] . "</option>";
		}
		?>
		</select>


		
		