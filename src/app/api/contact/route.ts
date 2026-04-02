import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const isDev = process.env.NEXT_PUBLIC_APP_ENV === "development";
const notifyTo = isDev
  ? ["info@kakushin-gijutu.com", "dev@r-h-y.jp"]
  : ["info@r-h-y.jp"];

const typeLabels: Record<string, string> = {
  buy: "物件の購入について",
  sell: "物件の売却について",
  rent: "賃貸物件について",
  consult: "不動産に関するご相談",
  other: "その他",
};

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, type, message } = await req.json();

    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    const typeLabel = typeLabels[type] || "未選択";

    // 自社宛の通知メール
    const notifyText = [
      "お問い合わせを受信しました",
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      `お名前: ${name}`,
      `メール: ${email}`,
      `電話番号: ${phone || "未入力"}`,
      `種別: ${typeLabel}`,
      "",
      "【お問い合わせ内容】",
      message,
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
    ].join("\n");

    await resend.emails.send({
      from: "合同会社RHY <dev@r-h-y.jp>",
      to: notifyTo,
      subject: `【お問い合わせ】${name}様 - ${typeLabel}`,
      html: `<div style="font-family: 'Helvetica Neue', Arial, 'Hiragino Sans', sans-serif; max-width: 600px; margin: 0 auto;"><pre style="font-family: inherit; font-size: 14px; line-height: 1.8; color: #1f2937; white-space: pre-wrap; word-wrap: break-word; margin: 0;">${notifyText}</pre></div>`,
    });

    // お客様宛の自動返信メール
    const replyText = [
      `${name} 様`,
      "",
      "この度はお問い合わせいただき、誠にありがとうございます。",
      "",
      "以下の内容でお問い合わせを承りました。",
      "内容を確認の上、担当者より折り返しご連絡いたしますので、",
      "今しばらくお待ちくださいませ。",
      "",
      "──────────────────────────────────",
      `種別: ${typeLabel}`,
      "",
      message,
      "──────────────────────────────────",
      "",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "合同会社RHY",
      "〒537-0002 大阪市東成区深江北一丁目3番5号 三好ビル306",
      "メール: info@kakushin-gijutu.com",
      "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━",
      "",
      "※ このメールは合同会社RHYのお問い合わせフォームより自動送信されています。",
    ].join("\n");

    await resend.emails.send({
      from: "合同会社RHY <dev@r-h-y.jp>",
      to: [email],
      subject: "【合同会社RHY】お問い合わせありがとうございます",
      html: `<div style="font-family: 'Helvetica Neue', Arial, 'Hiragino Sans', sans-serif; max-width: 600px; margin: 0 auto;"><pre style="font-family: inherit; font-size: 14px; line-height: 1.8; color: #1f2937; white-space: pre-wrap; word-wrap: break-word; margin: 0;">${replyText}</pre></div>`,
    });

    return NextResponse.json({ success: true });
  } catch (e: any) {
    console.error("Contact email error:", e);
    return NextResponse.json(
      { error: e.message || "メール送信に失敗しました" },
      { status: 500 }
    );
  }
}
