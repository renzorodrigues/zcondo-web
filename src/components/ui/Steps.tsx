import { ReactNode } from 'react';
import { RiBuilding2Line, RiBuilding4Line, RiHomeLine, RiUserLine } from 'react-icons/ri';

interface Step {
  id: string;
  title: string;
  description: string;
  icon: ReactNode;
}

interface StepsProps {
  steps: Step[];
  currentStep: string;
}

export default function Steps({ steps, currentStep }: StepsProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex flex-col items-center">
            <div className="flex items-center">
              {/* Linha conectora */}
              {index > 0 && (
                <div 
                  className={`h-0.5 w-16 md:w-24 ${
                    steps.findIndex(s => s.id === currentStep) >= index 
                      ? 'bg-purple-600' 
                      : 'bg-gray-200'
                  }`}
                />
              )}
              
              {/* Círculo do step */}
              <div 
                className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  steps.findIndex(s => s.id === currentStep) >= index 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step.icon}
              </div>
            </div>
            
            {/* Título e descrição */}
            <div className="mt-2 text-center">
              <div className={`text-sm font-medium ${
                steps.findIndex(s => s.id === currentStep) >= index 
                  ? 'text-purple-600' 
                  : 'text-gray-500'
              }`}>
                {step.title}
              </div>
              <div className="text-xs text-gray-500 hidden md:block">
                {step.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Componente de conveniência para o fluxo de cadastro de condomínio
export function CondominioSteps({ currentStep }: { currentStep: string }) {
  const steps = [
    {
      id: 'condominio',
      title: 'Condomínio',
      description: 'Informações básicas',
      icon: <RiBuilding2Line className="text-xl" />
    },
    {
      id: 'blocos',
      title: 'Blocos',
      description: 'Cadastro de blocos',
      icon: <RiBuilding4Line className="text-xl" />
    },
    {
      id: 'unidades',
      title: 'Unidades',
      description: 'Cadastro de unidades',
      icon: <RiHomeLine className="text-xl" />
    },
    {
      id: 'moradores',
      title: 'Moradores',
      description: 'Vinculação de moradores',
      icon: <RiUserLine className="text-xl" />
    }
  ];
  
  return <Steps steps={steps} currentStep={currentStep} />;
} 