import mongoose from "mongoose";

const InvoicesSchema = new mongoose.Schema(
  {
    projectId: {
      type: String,
    },
    family: {
      type: String,
    },
    subfamily: {
      type: String,
    },
    invoices: {
      type: String,
    },
    dateInvoices: {
      type: Date,
    },
    subcontractorOffers: {
      type: String,
    },
    description: {
      type: String,
    },

      preTotal: {
        type: Number,
      },
      nnccTotal: {
        type: Number,
      },
    totalInvoices: {
      type: Number,
    },
    invoiceStatus: {
      type: String,
    },
    dueDate: {
      type: Date,
    },
    paid: {
      type: Number,
    },
    accumulatedTotal: {
      type: Number,
    },
      nncc: {
          type: [Object]
      },
    observations: {
      type: String,
    },
      state: {
        type: String,
      },
      rawData: {
        type: Object
      },
      externalID: {
        type: String,
      }
  },
  {
    timestamps: true,
  }
);

export const InvoicesModel = mongoose.model("Invoices", InvoicesSchema);
