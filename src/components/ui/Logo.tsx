import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Logo({ size = 'md', className = '' }: LogoProps) {
  const sizes = {
    sm: { width: 120, height: 40 },
    md: { width: 160, height: 50 },
    lg: { width: 200, height: 60 },
  };

  return (
    <Link href="/" className={`inline-block ${className}`}>
      <div 
        style={{ 
          width: sizes[size].width, 
          height: sizes[size].height,
          backgroundColor: '#8B5CF6',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          fontSize: size === 'sm' ? '16px' : size === 'md' ? '20px' : '24px',
        }}
      >
        ZCondomínio
      </div>
    </Link>
  );
} 