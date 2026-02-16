import Order from "../models/Order.model.js";
export const totalsale = async (req, res) => {
  try {
    const data = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          paymentstatus: "paid",
        },
      },

      {
        $group: {
          _id: null,
          totalsale: {
            $sum: "$totalPrice",
          },
        },
      },
    ]);
    res.status(200).json({ sucess: true, data });
  } catch (err) {
    res.status(500).json({ sucess: false, error: err.message });
  }
};




export const getsalesrecord = async (req, res) => {
  try {

    const filter = { orderStatus: "Delivered" };

    const record = await Order.find(filter)
      .select("_id totalPrice orderStatus createdAt")
      .populate("user", "name")
      .sort({ createdAt: -1 }); 


    const countdeliveredorder = await Order.countDocuments(filter);

    res.status(200).json({
      success: true,
      record,
      countdeliveredorder
    });

  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

export const getMonthlyRevenue = async (req, res) => {
  try {
    const { month, year } = req.query;
    // month: 1-12

    const selectedYear = Number(year) || new Date().getFullYear();
    const selectedMonth = Number(month) -1 ; // JS months 0-11

    if (month === undefined) {
      return res
        .status(400)
        .json({ success: false, message: "Month is required" });
    }

    const startDate = new Date(selectedYear, selectedMonth, 1);
    const endDate = new Date(
      selectedYear,
      selectedMonth + 1,
      0,
      23,
      59,
      59
    );

    const revenue = await Order.aggregate([
      {
        $match: {
          orderStatus: "Delivered",
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      month,
      year: selectedYear,
      revenue: revenue[0]?.totalRevenue || 0,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
