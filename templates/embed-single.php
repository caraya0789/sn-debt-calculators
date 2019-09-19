<!DOCTYPE html>
<!--[if IE 7]>
<html class="ie ie7" lang="en-US">
<![endif]-->
<!--[if IE 8]>
<html class="ie ie8" lang="en-US">
<![endif]-->
<!--[if !(IE 7) | !(IE 8) ]><!-->
<html lang="en-US">
<!--<![endif]-->
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width">
	<title>Debt.ca Calculators</title>
	<link type="text/css" rel="stylesheet" href="/wp-content/themes/debtca-new/css/lib.min.css?v=1.0.0" />
	<link type="text/css" rel="stylesheet" href="/wp-content/plugins/sn-debt-calculators/css/lib.min.css?v=1.0.0" />
	<link type="text/css" rel="stylesheet" href="/wp-content/plugins/sn-debt-calculators/css/main.css?v=1.0.0" />
</head>
<body class="embeded-calc-single">
	<?php
		$type = !empty($_GET['type']) ? $_GET['type'] : 'repay';
		if(!file_exists(dirname(__FILE__) . '/' . $type . '.php'))
			$type = 'repay';

		$calculator = dirname(__FILE__) . '/' . $type . '.php';

		include $calculator;
	?>
	<script type="text/javascript" src="http://w.sharethis.com/button/buttons.js"></script>
	<script type="text/javascript" src="/wp-content/plugins/sn-debt-calculators/js/lib.min.js?v=1.0.0"></script>
	<script type="text/javascript" src="/wp-content/plugins/sn-debt-calculators/js/<?php echo $type ?>.js?v=1.0.0"></script>
</body>
</html>