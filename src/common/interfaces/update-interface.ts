export interface UpdatePay {
  mpPaymentMethod: string;   
  mpState: string;
  approvalDate: Date | null;
}