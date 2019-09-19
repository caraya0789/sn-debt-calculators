<div style="display:none" id="calc-container" class="calc-container js-guilt-calc">
  <script type="text/x-jsrender" id="guilt-item-tpl">
    <ul class="calc-debts">
      <li class="form-title">
        <label> <span class="num">{{:index}}</span> {{:habit}}</label><a href="#" class="delete">×</a>
      </li>
      <li class="form-header">
        <div class="col">
          <label>cost of item</label>
        </div>
        <div class="col">
          <label>how many</label>
        </div>
        <div class="col">
          <label>How many you will give up</label>
        </div>
      </li>
      <li class="form-row">
        <div class="col">
          <label class="xs">cost of item</label>
          <input placeholder="$" class="control js-habit-cost">
        </div>
        <div class="col two">
          <label class="xs">how many</label>
          <input placeholder="#" class="control js-habit-qty">
          <select class="control js-habit-fq">
            <option value="day">Per Day</option>
            <option value="week">Per Week</option>
            <option value="month">Per month</option>
          </select>
        </div>
        <div class="col">
          <label class="xs">How many you will give up</label>
          <div class="giveup-group">
            <input placeholder="#" class="control js-habit-giveup">
            <span class="js-giveup-period">per day</span>
          </div>
        </div>
      </li>
      <li class="form-result">
        <div class="col">
          <label>Yearly Cost of Habit<span class="js-cost-of-habit">$0</span></label>
        </div>
        <div class="col">
          <label>Yearly Savings<span class="js-savings">$0</span></label>
        </div>
      </li>
    </ul>
  </script>
  <script type="text/x-jsrender" id="additional-info-tpl">
    <h4>Guilt Chart</h4>
    <div class="chart">
      <div class="chart-graph">
        <canvas id="chart" width="125" height="125"></canvas>
      </div>
      <ul class="chart-details guilt">
        <li class="light-blue"><span class="circle"></span><span class="label">Total Yearly Cost</span><span class="value">{{currency:cost}}</span></li>
        <li class="blue"><span class="circle"></span><span class="label">Total Yearly Savings</span><span class="value">{{currency:savings}}</span></li>
      </ul>
    </div>
    <div class="calc-bottom">
      <a href="http://www.debt.ca/debt-relief" class="calc-btn orange lg one">Get Your Free Savings Estimate<i class="fa fa-angle-right"></i></a>
      <p>Not sure which debt <br> solution  is right for you?</p>
      <a href="http://www.debt.ca/debt-relief" class="calc-btn orange lg two">Get Your Free Savings Estimate<i class="fa fa-angle-right"></i></a>
      <a href="http://www.debt.ca" class="calc-logo" target="_blank"><img src="/wp-content/uploads/2015/08/logo-footer.png"/></a>
    </div>
  </script>
  <h3 class="calc-title">
    <div class="calc-float-right">
      <span displayText="Facebook" class="st_facebook_vcount"></span>
      <span displayText="Google +" class="st_googleplus_vcount"></span>
      <span displayText="Tweet" class="st_twitter_vcount"></span>
    </div>
    <?php if(!empty($_GET['title'])): ?>
    <?php echo htmlentities($_GET['title']) ?>
    <?php else: ?>
    Guilt <br> Calculator
    <?php endif ?>
  </h3>
  <div class="calc-form guilt">
    <div class="js-debts-form">
      <ul class="calc-debts only">
        <li class="form-title">
          <label> <span class="num">1</span> Cigarettes</label><a href="#" class="delete">×</a>
        </li>
        <li class="form-header">
          <div class="col">
            <label>cost of item</label>
          </div>
          <div class="col">
            <label>how many</label>
          </div>
          <div class="col">
            <label>How many you will give up</label>
          </div>
        </li>
        <li class="form-row">
          <div class="col">
            <label class="xs">cost of item</label>
            <input placeholder="$" class="control js-habit-cost">
          </div>
          <div class="col two">
            <label class="xs">how many</label>
            <input placeholder="#" class="control js-habit-qty">
            <select class="control js-habit-fq">
              <option value="day">Per Day</option>
              <option value="week">Per Week</option>
              <option value="month">Per month</option>
            </select>
          </div>
          <div class="col">
            <label class="xs">How many you will give up</label>
            <div class="giveup-group">
              <input placeholder="#" class="control js-habit-giveup">
              <span class="js-giveup-period">per day</span>
            </div>
          </div>
        </li>
        <li class="form-result">
          <div class="col">
            <label>Yearly Cost of Habit<span class="js-cost-of-habit">$0</span></label>
          </div>
          <div class="col">
            <label>Yearly Savings<span class="js-savings">$0</span></label>
          </div>
        </li>
      </ul>
    </div>
    <div class="form-row guilt-action">
      <select class="control calc-btn js-add-debt-select">
        <option value="">Add new item</option>
        <option>Cigarettes</option>
        <option>Beer</option>
        <option>Wine</option>
        <option>Liquor</option>
        <option>Gambling</option>
        <option>Movies</option>
        <option>Restaurants</option>
      </select>
    </div>
    <div class="form-row last"><a href="#" class="calc-btn orange lg js-calculate">Calculate<i class="fa fa-angle-right"></i></a></div>
  </div>
  <div class="calc-results">
    <div class="calc-result">
      <h3 class="calc-result-title">Additional Information <a href="#" class="toggler js-toggler"><i class="fa fa-angle-down"></i></a></h3>
      <div class="calc-result-content js-additional-info"></div>
    </div>
  </div>
</div>