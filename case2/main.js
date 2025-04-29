document.addEventListener('DOMContentLoaded', () => {
    // Elementos do DOM
    const elevator = document.querySelector('.elevator');
    const elevatorDoor = document.querySelector('.elevator-door');
    const display = document.querySelector('.display');
    const buttons = document.querySelectorAll('.btn-floor');
    
    // Estados do elevador
    let currentFloor = 0;     // Andar atual (começando no térreo)
    let targetFloor = null;   // Andar de destino
    let isMoving = false;     // Elevador em movimento?
    let direction = 0;        // Direção: 1 (subindo), -1 (descendo), 0 (parado)
    let doorState = 'closed'; // Estado da porta: 'open', 'closed', 'opening', 'closing'
    let requestedFloors = []; // Array de andares solicitados
    
    // Configurações de animação
    const FLOOR_HEIGHT = 115; // Altura de cada andar em pixels
    const MOVE_SPEED = 2;     // Velocidade do elevador (pixels por frame)
    const DOOR_OPEN_TIME = 2000;  // Tempo que a porta fica aberta (ms)
    const DOOR_OPERATION_TIME = 1000; // Tempo para abrir/fechar a porta (ms)
    
    // Posição inicial do elevador
    updateElevatorPosition(currentFloor);
    
    // Inicializa a porta como fechada
    elevatorDoor.classList.add('closed');
    
    // Adiciona evento de clique para todos os botões
    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const floor = parseInt(button.getAttribute('data-set-floor'));
        
        // Destaca o botão pressionado
        button.classList.add('active');
        
        // Regra especial: Se estiver no térreo e o botão do andar 3 for pressionado,
        // adiciona automaticamente o andar 2 à lista se ainda não estiver lá
        if (currentFloor === 0 && floor === 3 && !requestedFloors.includes(2)) {
          requestedFloors.push(2);
          // Destaca também o botão do andar 2
          const buttonFloor2 = document.querySelector('.btn-floor[data-set-floor="2"]');
          if (buttonFloor2) {
            buttonFloor2.classList.add('active');
          }
        }
        
        // Adiciona o andar ao array se não estiver lá
        if (!requestedFloors.includes(floor) && floor !== currentFloor) {
          requestedFloors.push(floor);
          
          // Se o elevador não estiver em movimento, começar o processo
          if (!isMoving) {
            processNextFloor();
          }
        } // Caso especial: botão do andar atual
        else if (floor === currentFloor && !isMoving) {
          // Abrir e fechar a porta imediatamente
          openDoor();
        
          // Remover o destaque do botão após abertura
          setTimeout(() => {
            button.classList.remove('active');
          }, DOOR_OPERATION_TIME + DOOR_OPEN_TIME); // após abertura e espera
        }
        
      });
    });
    
    // Função para determinar o próximo andar a visitar com base na direção atual
    function processNextFloor() {
      // Se não há andares solicitados, para o elevador
      if (requestedFloors.length === 0) {
        isMoving = false;
        direction = 0;
        return;
      }
      
      isMoving = true;
      
      // Se a direção não está definida ainda, determine-a com base nos andares solicitados
      if (direction === 0) {
        // Encontre o andar solicitado mais próximo
        let closestFloor = requestedFloors[0];
        let minDistance = Math.abs(currentFloor - closestFloor);
        
        for (let floor of requestedFloors) {
          const distance = Math.abs(currentFloor - floor);
          if (distance < minDistance) {
            minDistance = distance;
            closestFloor = floor;
          }
        }
        
        // Define a direção com base no andar mais próximo
        direction = (closestFloor > currentFloor) ? 1 : -1;
      }
      
      // Regra especial: Se estiver no térreo, indo para cima, e o andar 2 e 3 estão na lista,
      // devemos garantir que o andar 2 seja visitado antes do andar 3
      if (currentFloor === 0 && direction === 1 && 
          requestedFloors.includes(3) && requestedFloors.includes(2)) {
        // Reordenar a lista para garantir que o andar 2 venha antes do andar 3
        const index3 = requestedFloors.indexOf(3);
        const index2 = requestedFloors.indexOf(2);
        
        // Se o índice do andar 3 for menor (ou seja, seria visitado antes),
        // reordenar para que o andar 2 seja visitado primeiro
        if (index3 < index2) {
          requestedFloors.splice(index3, 1); // Remove o andar 3
          requestedFloors.push(3);           // Adiciona-o ao final
        }
      }
      
      // Agora, selecione o próximo andar na direção atual
      targetFloor = findNextFloorInDirection();
      
      // Se não houver andares na direção atual, inverta a direção
      if (targetFloor === null) {
        direction *= -1;
        targetFloor = findNextFloorInDirection();
        
        // Se ainda não houver andares, pare o elevador
        if (targetFloor === null) {
          isMoving = false;
          direction = 0;
          return;
        }
      }
      
      // Atualiza o display com o próximo andar
      updateDisplay(targetFloor);
      
      // Se já estiver no andar desejado, apenas abre a porta
      if (currentFloor === targetFloor) {
        openDoor();
        return;
      }
      
      // Primeiro feche a porta, depois mova o elevador
      if (doorState === 'closed') {
        // Se a porta já estiver fechada, espere um pouco e comece a mover
        setTimeout(() => {
          moveElevator();
        }, 500);
      } else {
        // Fecha a porta primeiro e depois move
        closeDoor(() => {
          // Depois que a porta fechar, espera um pouco e começa a mover
          setTimeout(() => {
            moveElevator();
          }, 500);
        });
      }
    }
    
    // Função para encontrar o próximo andar na direção atual
    function findNextFloorInDirection() {
      // Se subindo, encontre o próximo andar acima
      if (direction === 1) {
        let nextFloor = null;
        let minDistance = Infinity;
        
        for (let floor of requestedFloors) {
          if (floor > currentFloor && (floor - currentFloor) < minDistance) {
            nextFloor = floor;
            minDistance = floor - currentFloor;
          }
        }
        
        return nextFloor;
      } 
      // Se descendo, encontre o próximo andar abaixo
      else if (direction === -1) {
        let nextFloor = null;
        let minDistance = Infinity;
        
        for (let floor of requestedFloors) {
          if (floor < currentFloor && (currentFloor - floor) < minDistance) {
            nextFloor = floor;
            minDistance = currentFloor - floor;
          }
        }
        
        return nextFloor;
      }
      
      return null;
    }
    
    // Função para mover o elevador
    function moveElevator() {
      if (!targetFloor && targetFloor !== 0) return;
      
      // Calcula a posição alvo
      const targetPosition = getFloorPosition(targetFloor);
      const currentPosition = parseInt(elevator.style.bottom || '0');
      
      // Determina a direção do movimento
      const moveDirection = targetPosition > currentPosition ? 1 : -1;
      
      // Move o elevador um step por vez
      const newPosition = currentPosition + (MOVE_SPEED * moveDirection);
      
      // Verifica se chegou ou passou do destino
      if (
        (moveDirection === 1 && newPosition >= targetPosition) || 
        (moveDirection === -1 && newPosition <= targetPosition)
      ) {
        // Chegou ao destino
        elevator.style.bottom = `${targetPosition}px`;
        currentFloor = targetFloor;
        
        // Remove este andar da lista de requisições
        const index = requestedFloors.indexOf(targetFloor);
        if (index > -1) {
          requestedFloors.splice(index, 1);
        }
        
        // Remove o destaque do botão
        const activeButton = document.querySelector(`.btn-floor[data-set-floor="${targetFloor}"]`);
        if (activeButton) {
          activeButton.classList.remove('active');
        }
        
        // Abre a porta quando chegar ao andar
        openDoor();
      } else {
        // Continua movendo
        elevator.style.bottom = `${newPosition}px`;
        requestAnimationFrame(moveElevator);
      }
    }
    
    // Função para abrir a porta
    function openDoor(callback) {
      if (doorState === 'open' || doorState === 'opening') {
        if (callback) callback();
        return;
      }
      
      doorState = 'opening';
      elevatorDoor.classList.add('open');
      elevatorDoor.classList.remove('closed');
      
      // Depois que a porta abrir completamente
      setTimeout(() => {
        doorState = 'open';
        
        // Mantenha a porta aberta por um tempo
        setTimeout(() => {
          // Depois do tempo de espera, feche a porta
          closeDoor(() => {
            // Após fechar a porta, processa o próximo andar
            processNextFloor();
          });
          
        }, DOOR_OPEN_TIME);
        
        if (callback) callback();
      }, DOOR_OPERATION_TIME);
    }
    
    // Função para fechar a porta
    function closeDoor(callback) {
      if (doorState === 'closed' || doorState === 'closing') {
        if (callback) callback();
        return;
      }
      
      doorState = 'closing';
      elevatorDoor.classList.remove('open');
      elevatorDoor.classList.add('closed');
      
      // Depois que a porta fechar completamente
      setTimeout(() => {
        doorState = 'closed';
        if (callback) callback();
      }, DOOR_OPERATION_TIME);
    }
    
    // Função para calcular a posição do elevador baseado no andar
    function getFloorPosition(floor) {
      return floor * FLOOR_HEIGHT;
    }
    
    // Função para atualizar a posição do elevador
    function updateElevatorPosition(floor) {
      elevator.style.bottom = `${getFloorPosition(floor)}px`;
    }
    
    // Função para atualizar o display
    function updateDisplay(floor) {
      // Converte o andar para texto (0 = T, outros são números)
      const floorText = floor === 0 ? 'T' : floor.toString();
      display.textContent = `Andar ${floorText}`;
    }
    
    // Inicializa o display
    updateDisplay(currentFloor);
  });