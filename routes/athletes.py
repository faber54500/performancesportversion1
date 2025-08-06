from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy.orm import Session
from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_user
from fastapi.security import OAuth2PasswordBearer

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

@router.delete("/athletes/{id}")
def delete_athlete(id: int, current_user: schemas.User = Depends(get_current_user), db: Session = Depends(get_db)):
    # Vérification du rôle
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Accès refusé : seul un admin peut supprimer un athlète.")
    
    athlete = db.query(models.Athlete).filter(models.Athlete.id == id)
    if not athlete.first():
        raise HTTPException(status_code=404, detail="Athlète non trouvé")
    
    athlete.delete(synchronize_session=False)
    db.commit()
    return {"detail": "Athlète supprimé avec succès"}