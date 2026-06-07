from sqlalchemy.orm import Session
from database import AIModel, Battle, EloHistory
from config import settings

class EloService:
    def __init__(self, k_factor: int = 32):
        self.k_factor = k_factor

    def calculate_expected(self, rating_a: int, rating_b: int):
        expected_a = 1 / (1 + 10 ** ((rating_b - rating_a) / 400))
        expected_b = 1 - expected_a
        return expected_a, expected_b

    def calculate_new_ratings(self, rating_a: int, rating_b: int, winner: str):
        expected_a, expected_b = self.calculate_expected(rating_a, rating_b)
        
        if winner == "A":
            score_a, score_b = 1.0, 0.0
        elif winner == "B":
            score_a, score_b = 0.0, 1.0
        elif winner == "tie":
            score_a, score_b = 0.5, 0.5
        else:
            score_a, score_b = 0.4, 0.4

        new_rating_a = rating_a + self.k_factor * (score_a - expected_a)
        new_rating_b = rating_b + self.k_factor * (score_b - expected_b)
        
        return int(round(new_rating_a)), int(round(new_rating_b))

    def update_ratings(self, db: Session, battle: Battle):
        model_a = db.query(AIModel).filter(AIModel.id == battle.model_a_id).first()
        model_b = db.query(AIModel).filter(AIModel.id == battle.model_b_id).first()
        
        if not model_a or not model_b:
            return {}

        old_elo_a = model_a.elo_score
        old_elo_b = model_b.elo_score

        new_elo_a, new_elo_b = self.calculate_new_ratings(
            old_elo_a, old_elo_b, battle.winner
        )

        model_a.elo_score = new_elo_a
        model_b.elo_score = new_elo_b
        model_a.total_battles += 1
        model_b.total_battles += 1

        if battle.winner == "A":
            model_a.total_wins += 1
            model_b.total_losses += 1
        elif battle.winner == "B":
            model_b.total_wins += 1
            model_a.total_losses += 1
        elif battle.winner == "tie":
            model_a.total_ties += 1
            model_b.total_ties += 1

        db.add(EloHistory(
            model_id=model_a.id,
            battle_id=battle.id,
            old_elo=old_elo_a,
            new_elo=new_elo_a,
            change=new_elo_a - old_elo_a
        ))
        db.add(EloHistory(
            model_id=model_b.id,
            battle_id=battle.id,
            old_elo=old_elo_b,
            new_elo=new_elo_b,
            change=new_elo_b - old_elo_b
        ))

        db.commit()

        return {
            "model_a": {"old": old_elo_a, "new": new_elo_a, "change": new_elo_a - old_elo_a},
            "model_b": {"old": old_elo_b, "new": new_elo_b, "change": new_elo_b - old_elo_b}
        }

elo_service = EloService(k_factor=settings.ELO_K_FACTOR)
