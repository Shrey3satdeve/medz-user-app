import React from 'react';
import { Text, TextStyle } from 'react-native';

type IconProps = {
  size?: number;
  color?: string;
  fill?: string;
  strokeWidth?: number;
  style?: TextStyle;
};

const makeIcon = (emoji: string) => ({ size = 16, color = '#000', style = {} }: IconProps) => (
  <Text style={[{ fontSize: size, color, width: size, textAlign: 'center' }, style]}>{emoji}</Text>
);

// Map common icons used in the project to simple emoji placeholders
export const Home = makeIcon('🏠');
export const Pill = makeIcon('💊');
export const FlaskConical = makeIcon('🔬');
export const Dog = makeIcon('🐶');
export const User = makeIcon('👤');
export const Settings = makeIcon('⚙️');
export const Activity = makeIcon('📈');
export const FileText = makeIcon('📄');
export const ChevronRight = makeIcon('➡️');
export const Calendar = makeIcon('📅');
export const Box = makeIcon('📦');
export const ShoppingBag = makeIcon('🛍️');
export const Plus = makeIcon('+');
export const Minus = makeIcon('−');
export const Star = makeIcon('⭐');
export const ArrowLeft = makeIcon('◀️');
export const ShieldCheck = makeIcon('🛡️');
export const Clock = makeIcon('⏰');
export const AlertTriangle = makeIcon('⚠️');
export const Search = makeIcon('🔍');
export const XCircle = makeIcon('❌');
export const Cat = makeIcon('🐱');
export const Check = makeIcon('✅');
export const ArrowRight = makeIcon('➡️');
export const CheckCircle2 = makeIcon('✅');
export const Thermometer = makeIcon('🌡️');
export const Zap = makeIcon('⚡');
export const Mic = makeIcon('🎙️');
export const MapPin = makeIcon('📍');
export const ChevronDown = makeIcon('⬇️');
export const CreditCard = makeIcon('💳');
export const Banknote = makeIcon('💵');
export const Smartphone = makeIcon('📱');
export const Trash2 = makeIcon('🗑️');
export const Mail = makeIcon('✉️');
export const Lock = makeIcon('🔒');
export const LogOut = makeIcon('🚪');
export const Camera = makeIcon('📷');
export const Image = makeIcon('🖼️');
export const Download = makeIcon('⬇️');
export const Package = makeIcon('📦');
export const Truck = makeIcon('🚚');
export const Grid = makeIcon('🔲');
export const Printer = makeIcon('🖨️');
export const Stethoscope = makeIcon('🩺');

export default {};
