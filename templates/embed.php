<div class="container_selectpage">
	<div class="cal_right_widget">
		<div class="selection_calculator">Select Calculator</div>
		<div class="dropdown_back_bg_right" id="option_select">
			<select id="calculator_Type" class="option_dropdown form-control js-calc-type">
				<option value="repay">Debt Repayment Calculator</option>
				<option value="consolidation">Debt Consolidation Calculator</option>
				<option value="creditcard">Credit Card Debt Calculator</option>
				<option value="incomeratio">Debt to Income Ratio Calculator</option>
				<option value="guilt">Guilt Calculator</option>
			</select>
		</div>
		<div class="title_text">Calculator Title</div>
		<div class="row">
			<div class="col-sm-7 col-md-8 col-lg-9">
				<div><input id="title" type="text"  class="title_botom_textbox form-control js-calc-title" value="Debt Repayment Calculator"/></div>
			</div>
			<div class="generate_button col-sm-5 col-md-4 col-lg-3">
				<a href="" style="width:100%" class="btn btn-orange js-generate-code">Generate Code</a>
			</div>
		</div>
		<div class="title_text">Embed Code</div>
		<div><textarea name="Embed_code" id="Embed_code" cols="" rows="6" class="textarea_rightwidget_botom form-control js-embed-code" readonly="readonly"><?php 
			echo htmlentities('<iframe src="http://'.$_SERVER['HTTP_HOST'].'/embed/calculators?type=repay&title=Debt+Repayment+Calculator" width="100%" height="1040" frameborder="0" scrolling="yes" style="padding:0px;"></iframe>');
		?></textarea></div>
	</div>
	<br>
	<br>
	<iframe src="http://<?php echo $_SERVER['HTTP_HOST'] ?>/embed/calculators?type=repay&title=Debt+Repayment+Calculator" width="100%" height="1040" frameborder="0" scrolling="yes" style="padding:0px;"  id="calc_Selected"></iframe>
	<div style="clear:both;"></div>
</div>