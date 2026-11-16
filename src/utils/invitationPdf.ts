import { jsPDF } from 'jspdf';

export interface ReservationDetails {
  id: number | string;
  name: string;
  email: string;
  phone?: string;
  guests: number | string;
  reservation_date: string;
  reservation_time: string;
  occasion?: string;
  zone?: string;
  siphonRitual?: boolean;
  pastryPairing?: boolean;
  notes?: string;
}

export function generateLuxuryReservationPdf(details: ReservationDetails) {
  // A5 Landscape or Portrait. Let's do a stunning A5 Portrait (148 x 210 mm) or Letter format
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5',
  });

  const width = doc.internal.pageSize.getWidth();
  const height = doc.internal.pageSize.getHeight();

  // 1. Solid Obsidian Luxury Background (#0D0A07)
  doc.setFillColor(13, 10, 7);
  doc.rect(0, 0, width, height, 'F');

  // 2. Double Gold Foil Luxury Border (#C9A25E)
  doc.setDrawColor(201, 162, 94);
  doc.setLineWidth(0.8);
  doc.rect(8, 8, width - 16, height - 16);

  doc.setDrawColor(201, 162, 94);
  doc.setLineWidth(0.25);
  doc.rect(10.5, 10.5, width - 21, height - 21);

  // Corner Ornaments
  const drawCorner = (x: number, y: number, dx: number, dy: number) => {
    doc.setLineWidth(0.6);
    doc.line(x, y, x + dx * 6, y);
    doc.line(x, y, x, y + dy * 6);
    doc.setFillColor(201, 162, 94);
    doc.circle(x + dx * 2.5, y + dy * 2.5, 0.7, 'F');
  };
  drawCorner(13, 13, 1, 1);
  drawCorner(width - 13, 13, -1, 1);
  drawCorner(13, height - 13, 1, -1);
  drawCorner(width - 13, height - 13, -1, -1);

  // 3. Header: Brand Crest & Monogram
  doc.setFont('times', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(201, 162, 94);
  doc.text('EST. 1998  •  LONDON MAYFAIR', width / 2, 22, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(243, 234, 217);
  doc.text('MAISON NOIR', width / 2, 31, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(8.5);
  doc.setTextColor(201, 162, 94);
  doc.text('HAUTE SPECIALTY ROASTERY & SALON', width / 2, 36, { align: 'center' });

  // Divider Line with diamond center
  doc.setDrawColor(201, 162, 94);
  doc.setLineWidth(0.3);
  doc.line(30, 40, width / 2 - 4, 40);
  doc.line(width / 2 + 4, 40, width - 30, 40);
  doc.circle(width / 2, 40, 0.8, 'F');

  // 4. Invitation Title
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(232, 201, 138);
  doc.text('VIP GUEST INVITATION & TABLE PASS', width / 2, 48, { align: 'center' });

  // Confirmation Code Badge Box
  const confCode = `#MN-${String(details.id).padStart(5, '0')}`;
  doc.setFillColor(28, 22, 16);
  doc.setDrawColor(201, 162, 94);
  doc.setLineWidth(0.4);
  doc.roundedRect(width / 2 - 28, 52, 56, 9, 1.5, 1.5, 'FD');

  doc.setFont('courier', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(201, 162, 94);
  doc.text(`PASS ID: ${confCode}`, width / 2, 58, { align: 'center' });

  // 5. Formal Salutation
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(243, 234, 217);
  doc.text('Cordially presented for the pleasure of:', width / 2, 68, { align: 'center' });

  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(250, 245, 234);
  doc.text(details.name || 'Honored Guest', width / 2, 75, { align: 'center' });

  // 6. Reservation Card Details Box
  const boxTop = 82;
  const boxHeight = 68;
  doc.setFillColor(20, 16, 12);
  doc.setDrawColor(201, 162, 94);
  doc.setLineWidth(0.3);
  doc.roundedRect(15, boxTop, width - 30, boxHeight, 2, 2, 'FD');

  const addField = (label: string, value: string, yPos: number, isRightCol = false) => {
    const xPos = isRightCol ? width / 2 + 3 : 22;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(201, 162, 94);
    doc.text(label.toUpperCase(), xPos, yPos);

    doc.setFont('times', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(243, 234, 217);
    doc.text(value, xPos, yPos + 4.8);
  };

  addField('Date of Attendance', details.reservation_date || 'Confirmed', boxTop + 8);
  addField('Scheduled Arrival', details.reservation_time || '18:30', boxTop + 8, true);

  addField('Party Size', `${details.guests} Honored Guests`, boxTop + 20);
  addField('Reserved Atmosphere', details.zone || 'The Velvet Salon', boxTop + 20, true);

  addField('Occasion', details.occasion || 'Private Tasting Visit', boxTop + 32);
  addField('Contact Channel', details.phone || details.email || 'Registered', boxTop + 32, true);

  // VIP Enhancements section inside box
  let ritualText = 'Standard Tableside Service';
  if (details.siphonRitual && details.pastryPairing) {
    ritualText = 'Tableside Siphon Masterclass & Chef Pastry Flight';
  } else if (details.siphonRitual) {
    ritualText = 'Tableside Siphon Masterclass Ritual Included';
  } else if (details.pastryPairing) {
    ritualText = 'Chef Signature Pastry Pairing Included';
  }

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(201, 162, 94);
  doc.text('BESPOKE ENHANCEMENTS', 22, boxTop + 45);

  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(232, 201, 138);
  doc.text(ritualText, 22, boxTop + 50);

  if (details.notes) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(180, 160, 130);
    const splitNotes = doc.splitTextToSize(`Special Requests: ${details.notes}`, width - 44);
    doc.text(splitNotes, 22, boxTop + 57);
  }

  // 7. Venue Details & Atelier Protocol
  const venueTop = 156;
  doc.setFont('times', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(243, 234, 217);
  doc.text('MAISON NOIR ATELIER & SALON', width / 2, venueTop, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(201, 162, 94);
  doc.text('742 Evergreen Promenade, Mayfair, London W1K 7TP', width / 2, venueTop + 4.5, { align: 'center' });

  doc.setFont('times', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(180, 160, 130);
  doc.text('Valet Concierge at Main Portico  •  Smart Elegant Attire Requested', width / 2, venueTop + 9.5, { align: 'center' });
  doc.text('Please present this invitation upon arrival. Your private table will be held for 25 minutes.', width / 2, venueTop + 14, { align: 'center' });

  // 8. Seal of Authenticity
  doc.setDrawColor(201, 162, 94);
  doc.setLineWidth(0.4);
  doc.circle(width / 2, height - 24, 7, 'D');

  doc.setFont('times', 'bold');
  doc.setFontSize(6.5);
  doc.setTextColor(201, 162, 94);
  doc.text('VERIFIED', width / 2, height - 25, { align: 'center' });
  doc.text('RITUAL', width / 2, height - 22, { align: 'center' });

  doc.setFont('courier', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(160, 140, 110);
  doc.text('OFFICIAL DIGITAL PASS • AUTHENTICATED BY MAISON NOIR ROASTERY', width / 2, height - 13, { align: 'center' });

  // Save the PDF
  doc.save(`Maison_Noir_VIP_Invitation_${confCode.replace('#', '')}.pdf`);
}
